import { UploadFile } from "junto-design-system";
import { createContext, useCallback, useContext, useState } from "react";

interface FileContextProps {
  files: UploadFile[];
  handleSetFiles(files: UploadFile[]): void;
  deleteFile(id: string): void;
}

const FileContext =  createContext<FileContextProps>({} as FileContextProps);

const FileProvider: React.FC = ({ children }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const handleSetFiles = useCallback((files: UploadFile[]) => {
    setFiles(files);
  }, []);

  const deleteFile = (id: string) => {
    setFiles((state) => state.filter(file => file.id !== id));
  }

  return (
    <FileContext.Provider value={{ handleSetFiles, deleteFile, files}}>
      {children}
    </FileContext.Provider>
  );
}

function useFiles(): FileContextProps {
  const context = useContext(FileContext);

  if(!context) {
    throw new Error("useFiles must be use whithin FileProvider");
  }

  return context;
}

export { FileProvider, useFiles };
