import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Upload,
  UploadFile,
  UploadListFiles,
  makeToast,
} from 'junto-design-system';
import { nanoid } from '@reduxjs/toolkit';
import { BrokerPlatformAuthService } from '@services';
import handleError from '../../../helpers/handlerError';
import {
  getProposalDocuments,
  selectProposalDocuments,
} from '../../../application/features/proposalDocuments/ProposalDocumentsSlice';
import ProposalDocumentsApi from '../../../application/features/proposalDocuments/ProposalDocumentsApi';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { DOCUMENTS_NECESSARY } from '../../../constants';
import styles from './UploadDocuments.module.scss';

const UploadDocuments: FunctionComponent = () => {
  const [documents, setDocuments] = useState<UploadFile[]>([]);
  const dispatch = useDispatch();
  const { modality } = useSelector(selectQuote);
  const { identification } = useSelector(selectProposal);
  const { proposalDocuments } = useSelector(selectProposalDocuments);
  const types = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/bmp',
    'image/tiff',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
  ];

  useEffect(() => {
    if (!identification?.PolicyId) return;
    dispatch(getProposalDocuments(identification.PolicyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const documents: UploadFile[] = proposalDocuments.map(document => {
      const file = new File(
        [new ArrayBuffer(document.size)],
        document.filename,
      );
      return {
        id: nanoid(5),
        file,
        status: 'success',
      };
    });
    setDocuments(documents);
  }, [proposalDocuments]);

  const handleUploadDocument = (items: UploadFile[]) => {
    const updatedItems: UploadFile[] = items.map(item => ({
      ...item,
      status: 'loading',
    }));
    const allDocuments = [...documents, ...updatedItems];
    setDocuments(allDocuments);
    postProposalDocuments(allDocuments);
  };

  const setDocumentsStatusError = useCallback((files: UploadFile[]) => {
    const updatedDocuments: UploadFile[] = files.map(document => {
      if (document.status === 'loading') {
        return { ...document, status: 'error-send' };
      }
      return document;
    });
    setDocuments(updatedDocuments);
  }, []);

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
        .catch(() => setDocumentsStatusError(files));
    },
    [dispatch, identification, setDocumentsStatusError],
  );

  const handleRemoveDocument = useCallback(
    async (id: string) => {
      if (!identification) return;
      const document = documents.find(document => document.id === id);
      setDocuments(
        documents.map(document => {
          if (document.id === id) {
            return { ...document, status: 'processing' };
          }
          return document;
        }),
      );
      if (!document) return;
      await ProposalDocumentsApi.deleteProposalDocument(
        identification.PolicyId,
        document.file.name,
      )
        .then(() => dispatch(getProposalDocuments(identification.PolicyId)))
        .catch(error => {
          makeToast('error', handleError(error.data));
          setDocuments(
            documents.map(document => {
              if (document.id === id) {
                return { ...document, status: 'success' };
              }
              return document;
            }),
          );
        });
    },
    [dispatch, documents, identification],
  );

  const renderDocumentsNecessaryList = () => {
    if (!modality) return null;
    return DOCUMENTS_NECESSARY[modality.id].map(document => (
      <li key={nanoid(5)} className={styles['upload-documents__list-item']}>
        {document}
      </li>
    ));
  };

  return (
    <div className={styles['upload-documents__wrapper']}>
      <h3 className={styles['upload-documents__title']}>Envio de documentos</h3>
      <ul className={styles['upload-documents__list']}>
        <li className={styles['upload-documents__list-item']}>
          Precisaremos de alguns documentos para analisar sua proposta. Por
          favor, anexe abaixo:
        </li>
        {renderDocumentsNecessaryList()}
      </ul>
      <Upload
        fullWidth
        maxFileSize={10}
        multipleFiles
        types={types}
        showMaxFileSize={false}
        onCallbackUpload={handleUploadDocument}
      />
      <UploadListFiles
        items={documents}
        onCallbackRemove={handleRemoveDocument}
      />
    </div>
  );
};

export default UploadDocuments;
