import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Upload, UploadFile, UploadListFiles } from 'junto-design-system';
import { nanoid } from '@reduxjs/toolkit';
import { FILE_TYPES } from '../../../constants';
import styles from './UploadDocument.module.scss';

export interface UploadDocumentProps {
  onUploadDocuments: (files: UploadFile[]) => void;
  onRemoveDocument: (filename: string) => void;
  storeDocuments: {
    name: string;
    url: string;
    size: number;
  }[];
  multipleFiles?: boolean;
  hasError?: boolean;
}

const UploadDocument: FunctionComponent<UploadDocumentProps> = ({
  onUploadDocuments,
  onRemoveDocument,
  storeDocuments,
  multipleFiles = true,
  hasError = false,
}) => {
  const [documents, setDocuments] = useState<UploadFile[]>([]);

  useEffect(() => {
    const documents: UploadFile[] = storeDocuments.map(document => {
      const file = new File([new ArrayBuffer(document.size)], document.name);
      return {
        id: nanoid(5),
        file,
        status: 'success',
      };
    });
    setDocuments(documents);
  }, [storeDocuments]);

  useEffect(() => {
    if (hasError) setDocumentsStatus('error-send', 'loading');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasError]);

  const handleUploadDocument = (items: UploadFile[]) => {
    const updatedItems: UploadFile[] = items.map(item => ({
      ...item,
      status: 'loading',
    }));
    const allDocuments = [...documents, ...updatedItems];
    setDocuments(allDocuments);
    onUploadDocuments(updatedItems);
  };

  const setDocumentsStatus = useCallback(
    (status: string, prevStatus?: string | null, id?: string) => {
      const updatedDocuments: UploadFile[] = documents.map(document => {
        if (
          (prevStatus && document.status === prevStatus) ||
          (id && document.id === id)
        ) {
          return { ...document, status: status as any };
        }

        return document;
      });
      setDocuments(updatedDocuments);
    },
    [documents],
  );

  const handleRemoveDocument = useCallback(
    async (id: string) => {
      const document = documents.find(document => document.id === id);
      setDocumentsStatus('processing', null, id);
      if (!document) return;
      onRemoveDocument(document.file.name);
    },
    [documents, onRemoveDocument, setDocumentsStatus],
  );

  return (
    <div className={styles['upload-document__wrapper']}>
      <Upload
        fullWidth
        maxFileSize={30}
        multipleFiles={multipleFiles}
        types={FILE_TYPES.default}
        onCallbackUpload={handleUploadDocument}
        errorMessage="Formato inválido. Utilize arquivos: .jpg, .jpeg, .pdf, .png, .doc, .docx, .xls, .xlsx, .tiff, .bmp e .rtf."
      />
      <UploadListFiles
        items={documents}
        onCallbackRemove={id => handleRemoveDocument(id)}
      />
    </div>
  );
};

export default UploadDocument;
