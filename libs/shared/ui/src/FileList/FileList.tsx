import { useContext } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import className from 'classnames';
import { LinkButton, ThemeContext } from 'junto-design-system';
import { downloadFile } from '@shared/utils';

import styles from './FileList.module.scss';

export interface FileListProps {
  files: {
    filename: string;
    size: number;
    url: string | File;
  }[];
}

export const FileList: React.FC<FileListProps> = ({ files }) => {
  const theme = useContext(ThemeContext);

  const handleDownloadDocuments = () => {
    files.forEach(file => downloadFile(file.url));
  };

  const renderFiles = () => {
    if (files.length > 0) {
      return (
        <>
          {files.map(file => (
            <p
              className={className(styles['file-list__item'], styles[theme])}
              key={nanoid(5)}
            >
              {file.filename}
              <span>{(file.size / 1048576).toFixed(2)} MB</span>
            </p>
          ))}
          {files.length > 0 && (
            <LinkButton
              label="Ver anexos"
              icon="download"
              onClick={() => handleDownloadDocuments()}
              data-testid="fileList-button-dowload-files"
            />
          )}
        </>
      );
    }

    return null;
  };

  return renderFiles();
};
