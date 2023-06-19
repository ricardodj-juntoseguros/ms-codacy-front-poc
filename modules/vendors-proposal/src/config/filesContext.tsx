import { UploadFile, makeToast } from 'junto-design-system';
import { createContext, useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import UploadDocumentAPI from '../application/features/uploadDocument/UploadDocumentAPI';
import { selectProposal } from '../application/features/proposal/ProposalSlice';

interface FileContextProps {
  files: UploadFile[];
  handleSetFiles(files: UploadFile[]): void;
  deleteFile(id: string): void;
  uploadDocuments(): boolean | Promise<boolean>;
}

export interface UploadFileModel extends UploadFile {
  uploaded?: boolean;
}

const FileContext = createContext<FileContextProps>({} as FileContextProps);

const FileProvider: React.FC = ({ children }) => {
  const [files, setFiles] = useState<UploadFileModel[]>([]);
  const { identification } = useSelector(selectProposal);

  const handleSetFiles = useCallback((files: UploadFile[]) => {
    setFiles(files);
  }, []);

  const uploadDocuments = useCallback(async () => {
    if (!identification || !identification.policyId) return false;

    const formData = new FormData();
    files.forEach(document =>
      formData.append('files', document.file, document.file.name),
    );

    return UploadDocumentAPI.uploadDocument(identification.policyId, formData)
      .then(() => {
        setFiles(files.map(file => ({ ...file, uploaded: true })));
        return true;
      })
      .catch(error => {
        const message =
          error && error.data && error.data.data && error.data.data.message
            ? error.data.data[0].message
            : 'Ocorreu um erro inesperado ao realizar o upload dos arquivos. Por favor, tente novamente.';
        makeToast('error', message);
        return false;
      });
  }, [files, identification]);

  const deleteFile = (id: string) => {
    setFiles(state => state.filter(file => file.id !== id));
  };

  return (
    <FileContext.Provider
      value={{ handleSetFiles, deleteFile, uploadDocuments, files }}
    >
      {children}
    </FileContext.Provider>
  );
};

function useFiles(): FileContextProps {
  const context = useContext(FileContext);

  if (!context) {
    throw new Error('useFiles must be use whithin FileProvider');
  }

  return context;
}

export { FileProvider, useFiles };
