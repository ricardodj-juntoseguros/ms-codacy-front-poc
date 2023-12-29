import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeToast } from 'junto-design-system';
import { useParams } from 'react-router';
import { BrokerPlatformAuthService } from '@services';
import { nanoid } from 'nanoid/non-secure';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { ProposalResumeDTO } from '../../../application/types/dto';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import InsuredSelectionApi from '../../../application/features/insuredSelection/InsuredSelectionApi';
import ModalitySelecionApi from '../../../application/features/modalitySelection/ModalitySelecionApi';
import { InsuredModel, ModalityModel } from '../../../application/types/model';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { policyholderSelectionActions } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import { modalitySelectionActions } from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import { insuredSelectionActions } from '../../../application/features/insuredSelection/InsuredSelectionSlice';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import { mapPolicyholderSearchOptions } from '../../../helpers';
import handleError from '../../../helpers/handlerError';

export const useProposalResume = () => {
  const dispatch = useDispatch();
  const { identification } = useParams<{ identification: string }>();
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
  const {
    setQuoteResumeData,
    setPolicyholder,
    setPolicyholderAffiliate,
    setModality,
  } = quoteSliceActions;
  const {
    setPolicyholderOptions,
    setPolicyholderAffiliatesOptions,
    setPolicyholderSearchValue,
  } = policyholderSelectionActions;
  const { setModalityOptions } = modalitySelectionActions;
  const {
    setInsuredAddressesOptions,
    setInsuredSearchValue,
    setInsuredOptions,
  } = insuredSelectionActions;
  const { setProposalResumeData } = proposalActions;

  useEffect(() => {
    if (identification) {
      ProposalApi.getProposalResume(Number.parseInt(identification, 10))
        .then(response => rehydrateStoresWithProposalData(response))
        .catch(err => {
          if (err.status && err.status === 404) {
            makeToast('error', handleError(err));
            return;
          }
          if (err.status && err.status === 403) {
            makeToast('error', 'Acesso Negado');
            return;
          }
          makeToast(
            'error',
            'Ocorreu um erro ao recuperar os dados do documento.',
          );
        })
        .finally(() => {
          setFinishedLoading(true);
        });
    } else {
      setFinishedLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identification]);

  const rehydrateStoresWithProposalData = async (data: ProposalResumeDTO) => {
    const {
      metadata,
      policyholderId,
      policyholderFederalId,
      policyholderAffiliateFederalId,
      modalityId,
      insuredId,
      insuredFederalId,
      insuredAddressId,
      biddingNumber,
      biddingDescription,
    } = data;

    const broker = BrokerPlatformAuthService.getBroker();
    if (!broker) return;

    const policyholderSearch =
      await PolicyholderSelectionApi.searchPolicyHolder(policyholderFederalId);

    if (policyholderSearch.records.length === 0) {
      makeToast('error', 'Dados do tomador não encontrados.');
      return;
    }

    const policyholderSearchOptions =
      mapPolicyholderSearchOptions(policyholderSearch);
    dispatch(setPolicyholderOptions(policyholderSearchOptions));

    const policyholderDetails =
      await PolicyholderSelectionApi.getPolicyholderDetails(
        broker.externalId,
        policyholderFederalId,
      )
        .then(response => response)
        .catch(() => {
          return null;
        });

    if (
      !policyholderDetails ||
      policyholderDetails.registrationData.id !== policyholderId
    ) {
      makeToast(
        'error',
        'Houve um erro inesperado ao buscar os dados do tomador desta proposta.',
      );
      return;
    }
    const { affiliates, registrationData } = policyholderDetails;
    dispatch(setPolicyholder(registrationData));
    dispatch(setPolicyholderSearchValue(policyholderSearchOptions[0].label));
    dispatch(setPolicyholderAffiliatesOptions(affiliates));

    if (affiliates.length > 0 && policyholderAffiliateFederalId) {
      const affiliateToSet = affiliates.find(
        affiliate =>
          affiliate.federalId.replace(/[^\d]+/g, '') ===
          policyholderAffiliateFederalId,
      );
      if (affiliateToSet)
        dispatch(
          setPolicyholderAffiliate({
            ...affiliateToSet,
            label: `${affiliateToSet.city} - ${affiliateToSet.state} - CNPJ: ${affiliateToSet.federalId}`,
            value: nanoid(5),
          }),
        );
    }

    const modalities = await ModalitySelecionApi.fetchModalities(
      broker.federalId,
      policyholderFederalId,
    ).then(response => {
      return response.map(modality => ({
        ...modality,
        value: modality.id.toString(),
        label: modality.description,
      })) as ModalityModel[];
    });
    dispatch(setModalityOptions(modalities));

    const modalityToSet = modalities.find(
      modality => modality.id === modalityId,
    );

    if (!modalityToSet) {
      makeToast('error', 'Modalidade do documento inválida');
      return;
    }

    dispatch(setModality(modalityToSet));
    dispatch(setQuoteResumeData(data));

    if (insuredId && insuredFederalId) {
      const insureds = await InsuredSelectionApi.searchInsured(insuredFederalId)
        .then(response => response.records)
        .catch(() => {
          return [];
        });

      const mappedInsureds = insureds.map(insured => ({
        ...insured,
        value: insured.insuredId.toString(),
        label: insured.name,
      })) as InsuredModel[];

      const insuredToSet = mappedInsureds.find(
        ({ federalId, insuredId: id }) =>
          federalId === insuredFederalId && id === insuredId,
      );
      if (!insuredToSet) {
        makeToast('error', 'Dados do segurado da proposta não encontrados.');
        return;
      }
      const insuredAddress = insuredToSet.addresses.find(
        address => address.addressId === insuredAddressId,
      );

      dispatch(setInsuredOptions(mappedInsureds));
      dispatch(setInsuredSearchValue(insuredToSet.name));
      dispatch(setInsuredAddressesOptions(insuredToSet.addresses));
      dispatch(
        setProposalResumeData({
          insured: insuredToSet,
          insuredAddress: insuredAddress
            ? {
                ...insuredAddress,
                value: insuredAddress.addressId.toString(),
                label: `${insuredAddress.street} - ${insuredAddress.city}, ${insuredAddress.state}`,
              }
            : null,
          biddingNumber,
          biddingDescription,
          identification: {
            PolicyId: Number.parseInt(`${metadata.policyid}`, 10),
          },
        }),
      );
    }
  };

  return finishedLoading;
};
