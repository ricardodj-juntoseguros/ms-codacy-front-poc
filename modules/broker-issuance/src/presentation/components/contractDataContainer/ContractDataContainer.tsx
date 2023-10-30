import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchInsuredSliceThunks } from '../../../application/features/searchInsured/thunks';
import { selectFlow } from '../../../application/features/flow/FlowSlice';
import { ContractData } from '../contractData/ContractData';
import { selectSearchInsured } from '../../../application/features/searchInsured/SearchInsuredSlice';
import {
  selectQuote,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import {
  AddressModel,
  InstallmentModel,
  InsuredModel,
} from '../../../application/types/model';
import { getStepByName } from '../../../helpers';
import { EmissionContainer } from '../emissionContainer';

export function ContractDataContainer() {
  const dispatch = useDispatch();
  const [insuredInput, setInsuredInput] = useState('');

  const { contractData, installments, loadingQuote } = useSelector(selectQuote);
  const {
    insured,
    address,
    contractNumber,
    attachmentNotice,
    installment,
    firstInstallment,
    contacts,
    policyInProgress,
    comments,
  } = contractData;
  const { addresses = [], insuredTypeDescription } = {
    ...insured,
  } as InsuredModel;

  const { searchInsuredOptions } = useSelector(selectSearchInsured);

  const { steps } = useSelector(selectFlow);
  const stepStatus = useMemo(() => {
    return getStepByName('ContractDataContainer', steps);
  }, [steps]);

  function handleChangeInsuredInput(value: string) {
    setInsuredInput(value);

    if (value !== '') {
      dispatch(searchInsuredSliceThunks.searchInsured(value));
    }
  }

  function handleInsuredSelection(selectedInsured: InsuredModel) {
    dispatch(quoteSliceActions.setContractInsured(selectedInsured));
  }

  function handleAddressSelection(selectedAddress: AddressModel) {
    dispatch(quoteSliceActions.setContractInsuredAddress(selectedAddress));
  }

  function handleChangeContractNumber(value: string) {
    dispatch(quoteSliceActions.setContractNumber(value));
  }

  function handleChangeAttachmentNotice(value: string) {
    dispatch(quoteSliceActions.setContractAttachmentNotice(value));
  }

  function handleChangeContractInstallment(installment: InstallmentModel) {
    dispatch(quoteSliceActions.setContractInstallment(installment));
  }

  function handleChangeFirstInstallment(installmentDate: string) {
    dispatch(quoteSliceActions.setContractFirstInstallment(installmentDate));
  }

  function handleChangeContactEmails(emails: string[]) {
    dispatch(quoteSliceActions.setContractContacts(emails));
  }

  function handleTogglePolicyInProgress() {
    dispatch(quoteSliceActions.setContractPolicyInProgress(!policyInProgress));
  }

  function handleChangeComments(value: string) {
    dispatch(quoteSliceActions.setContractComments(value));
  }

  useEffect(() => {
    if (insured) {
      setInsuredInput(insured.name);
    }
  }, [insured]);

  function StepTitle() {
    return (
      <title>
        Complete os <strong>dados</strong>
      </title>
    );
  }

  return (
    <div>
      <ContractData
        insuredInput={insuredInput}
        insuredOptions={searchInsuredOptions}
        address={address}
        addressOptions={addresses}
        onChangeInsuredInput={handleChangeInsuredInput}
        onSelectInsured={handleInsuredSelection}
        onSelectAddress={handleAddressSelection}
        insuredTypeDescription={insuredTypeDescription}
        contractNumber={contractNumber}
        onChangeContractNumber={handleChangeContractNumber}
        attachmentNotice={attachmentNotice}
        onChangeAttachmentNotice={handleChangeAttachmentNotice}
        policyPreview={{
          title: 'O objeto da sua apólice de seguro ficará assim:',
          description:
            'Esta apólice, de riscos declarados, garante indenização, até o valor fixado na apólice, dos prejuízos causados pelo Tomador ao Segurado, em razão de inadimplemento na prestação dos serviços descritos no objeto do Contrato',
        }}
        installment={installment}
        installmentOptions={installments}
        onSelectInstallment={handleChangeContractInstallment}
        firstInstallment={firstInstallment}
        onChangeFirstInstallment={handleChangeFirstInstallment}
        onChangeEmails={handleChangeContactEmails}
        emails={contacts}
        policyInProgress={policyInProgress}
        onChangePolicyInProgress={handleTogglePolicyInProgress}
        comments={comments}
        onChangeComments={handleChangeComments}
      />
      <EmissionContainer />
    </div>
  );
}
