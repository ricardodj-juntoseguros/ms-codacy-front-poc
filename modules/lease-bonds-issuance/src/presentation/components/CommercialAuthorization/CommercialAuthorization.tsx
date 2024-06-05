/* eslint-disable consistent-return */
import { FunctionComponent, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UploadFile, RadioGroup, RadioButton } from 'junto-design-system';
import ProposalDocumentsApi from '../../../application/features/proposalDocuments/ProposalDocumentsApi';
import CommercialAuthorizationApi from '../../../application/features/CommercialAuthorization/CommercialAuthorizationApi';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import {
  commercialAuthorizationActions,
  selectCommercialAuthorization,
} from '../../../application/features/CommercialAuthorization/CommercialAuthorizationSlice';
import { CommercialAuthorizationTypeEnum } from '../../../application/types/model';
import ContactInputList from '../ContactInputList';
import UploadDocument from '../UploadDocument';
import styles from './CommercialAuthorization.module.scss';

const CommercialAuthorization: FunctionComponent = () => {
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();
  const { typeOfAuthorization, approvalContacts, documentsForAuthorization } =
    useSelector(selectCommercialAuthorization);
  const { identification } = useSelector(selectProposal);
  const {
    setTypeOfAuthorization,
    setApprovalContacts,
    setDocumentsForAuthorization,
  } = commercialAuthorizationActions;

  const postCommercialAuthorizationLetter = useCallback(
    async (authorization: UploadFile[]) => {
      if (!identification) return;
      const formData = new FormData();
      formData.append(
        'file',
        authorization[0].file,
        authorization[0].file.name,
      );
      await CommercialAuthorizationApi.postCommercialAuthorizationLetter(
        identification.PolicyId,
        formData,
      )
        .then(response => {
          dispatch(
            setDocumentsForAuthorization([
              ...documentsForAuthorization,
              {
                name: authorization[0].file.name,
                url: response.urlLocation,
                size: authorization[0].file.size,
              },
            ]),
          );
        })
        .catch(() => setHasError(true));
    },
    [
      dispatch,
      documentsForAuthorization,
      identification,
      setDocumentsForAuthorization,
    ],
  );

  const deleteAuthorization = useCallback(
    async (filename: string) => {
      if (!identification) return;
      await ProposalDocumentsApi.deleteProposalDocument(
        identification.PolicyId,
        filename,
      )
        .then(() => {
          dispatch(
            setDocumentsForAuthorization(
              documentsForAuthorization.filter(
                document => document.name !== filename,
              ),
            ),
          );
        })
        .catch(() => setHasError(true));
    },
    [
      dispatch,
      documentsForAuthorization,
      identification,
      setDocumentsForAuthorization,
    ],
  );

  const handleSetTypeOfAuthorization = (
    value: CommercialAuthorizationTypeEnum,
  ) => {
    dispatch(setTypeOfAuthorization(value));
  };

  const handleSetApprovalContacts = (emails: string[]) => {
    dispatch(setApprovalContacts(emails));
  };

  const renderComponent = () => {
    switch (typeOfAuthorization) {
      case 'sendToApproval':
        return (
          <ContactInputList
            idPrefix="commercialAuthorization"
            inputLabel="Adicionar e-mail de recebimento"
            contacts={approvalContacts}
            onChangeContacts={handleSetApprovalContacts}
          />
        );
      case 'hasAuthorization':
        return (
          <UploadDocument
            onUploadDocuments={postCommercialAuthorizationLetter}
            onRemoveDocument={deleteAuthorization}
            storeDocuments={documentsForAuthorization}
            multipleFiles={false}
            hasError={hasError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles['commercial-authorization__wrapper']}>
      <h3 className={styles['commercial-authorization__title']}>
        Autorizar emissão da apólice
      </h3>
      <p className={styles['commercial-authorization__text']}>
        Por questões de segurança, precisamos que você garanta que o corretor
        está ciente dessa emissão. Você pode enviar essa proposta para aprovação
        ou anexar uma autorização.
      </p>
      <RadioGroup
        name="typeOfAuthorization"
        value={typeOfAuthorization}
        onChange={v =>
          handleSetTypeOfAuthorization(v as CommercialAuthorizationTypeEnum)
        }
      >
        <div className={styles['commercial-authorization__radio-wrapper']}>
          <RadioButton
            id="commercialAuthorization-sendToApproval-radio-button"
            data-testid="commercialAuthorization-sendToApproval-radio-button"
            value="sendToApproval"
            label="Enviar para aprovação do corretor"
          />
          <RadioButton
            id="commercialAuthorization-hasAuthorization-radio-button"
            data-testid="commercialAuthorization-hasAuthorization-radio-button"
            value="hasAuthorization"
            label="Tenho uma autorização para emissão"
          />
        </div>
      </RadioGroup>
      {renderComponent()}
    </div>
  );
};

export default CommercialAuthorization;
