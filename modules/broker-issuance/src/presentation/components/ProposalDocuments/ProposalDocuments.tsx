import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UploadFile } from 'junto-design-system';
import { BrokerPlatformAuthService } from '@services';
import {
  getInternalizeDocumentList,
  getProposalDocuments,
  selectProposalDocuments,
} from '../../../application/features/proposalDocuments/ProposalDocumentsSlice';
import ProposalDocumentsApi from '../../../application/features/proposalDocuments/ProposalDocumentsApi';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import UploadDocument from '../UploadDocument';
import styles from './ProposalDocuments.module.scss';
import { InternalizeDocumentsSkeleton } from '../Skeletons';

const ProposalDocuments: FunctionComponent = () => {
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();
  const { modality } = useSelector(selectQuote);
  const { identification } = useSelector(selectProposal);
  const {
    proposalDocuments,
    loadingInternalizeDocumentsList,
    internalizeDocumentsList,
  } = useSelector(selectProposalDocuments);

  useEffect(() => {
    if (!identification?.PolicyId) return;
    dispatch(getProposalDocuments(identification.PolicyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!modality) return;
    dispatch(getInternalizeDocumentList(modality.id));
  }, [modality, dispatch]);

  const postProposalDocuments = useCallback(
    async (files: UploadFile[]) => {
      const userType = BrokerPlatformAuthService.getUserType();
      if (userType === null || !identification) return;
      const formData = new FormData();
      files.forEach(document =>
        formData.append('files', document.file, document.file.name),
      );
      await ProposalDocumentsApi.postProposalDocument(
        identification.PolicyId,
        userType,
        formData,
      )
        .then(() => dispatch(getProposalDocuments(identification.PolicyId)))
        .catch(() => setHasError(true));
    },
    [dispatch, identification],
  );

  const handleRemoveDocument = useCallback(
    async (filename: string) => {
      if (!identification) return;
      await ProposalDocumentsApi.deleteProposalDocument(
        identification.PolicyId,
        filename,
      )
        .then(() => dispatch(getProposalDocuments(identification.PolicyId)))
        .catch(() => setHasError(true));
    },
    [dispatch, identification],
  );

  const renderDocumentsNecessaryList = () => {
    if (!modality) return null;
    if (loadingInternalizeDocumentsList)
      return <InternalizeDocumentsSkeleton />;
    return internalizeDocumentsList.map(document => (
      <li
        key={`document-${document.documentId}`}
        className={styles['proposal-documents__list-item']}
      >
        - {document.description}.
      </li>
    ));
  };

  return (
    <div className={styles['proposal-documents__wrapper']}>
      <h3 className={styles['proposal-documents__title']}>
        Envio de documentos
      </h3>
      <ul className={styles['proposal-documents__list']}>
        <li className={styles['proposal-documents__list-item']}>
          Precisaremos de alguns documentos para analisar sua proposta. Por
          favor, anexe abaixo:
        </li>
        {renderDocumentsNecessaryList()}
      </ul>
      <UploadDocument
        onUploadDocuments={postProposalDocuments}
        onRemoveDocument={handleRemoveDocument}
        storeDocuments={proposalDocuments}
        multipleFiles
        hasError={hasError}
      />
    </div>
  );
};

export default ProposalDocuments;
