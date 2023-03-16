import { useState, useEffect } from 'react';
import {
  LinkButton,
  Button,
  Upload,
  UploadFile,
  UploadListFiles,
  Modal,
} from 'junto-design-system';
import { SuccessIllustration } from '@shared/ui';
import { useHistory } from 'react-router-dom';
import ImportMappingApi from '../../../application/features/importMapping/ImportMappingApi';
import styles from './UploaderFile.module.scss';

function UploaderFile() {
  const [dataFiles, setDataFiles] = useState<UploadFile[]>([]);
  const [processId, setProcessId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [onError, setOnError] = useState(false);

  const handleUploadCallBack = (items: UploadFile[]) => {
    setDataFiles(items);
    fetchUploadProcessId();
  };

  const history = useHistory();

  function handleGoToHome() {
    history.push('/');
  }

  const handleRemoveFile = (id: string) => {
    setDataFiles([...dataFiles.filter(file => file.id !== id)]);
  };

  const fetchUploadProcessId = () => {
    setOnError(false);
    if (processId === 0) {
      new ImportMappingApi()
        .generateUploadProcessId()
        .then(response => {
          setProcessId(response.id);
        })
        .catch(() => {
          setOnError(true);
        });
    }
  };

  const fetchUploadFile = () => {
    if (!onError) {
      setDataFiles([{ ...dataFiles[0], status: 'loading' }]);
      new ImportMappingApi()
        .sendUploadFile(processId, dataFiles[0].file)
        .then(response => {
          response
            ? setDataFiles([{ ...dataFiles[0], status: 'success' }])
            : '';
        })
        .catch(() => {
          setOnError(true);
        })
        .finally(() => {
          if (!onError) {
            setDataFiles([{ ...dataFiles[0], status: 'success' }]);
            fetchCheckoutUpload();
          }
        });
    }
  };

  const fetchCheckoutUpload = () => {
    if (!onError) {
      setIsOpen(true);
      new ImportMappingApi()
        .finalizeUploadProcess(processId)
        .then(response => {
          response ? setOnError(false) : '';
        })
        .catch(() => {
          setOnError(true);
          setIsOpen(false);
        });
    }
  };

  const onCloseModal = () => {
    setProcessId(0);
    setIsOpen(false);
    setOnError(false);
    setDataFiles([]);
  };

  const getModalTemplate = () => {
    return {
      title: {
        value: 'Solicitação enviada! Vamos analisar sua solicitação.',
        align: 'center' as any,
        fontWeight: 'bold' as any,
      },
      text: {
        value:
          'Isso pode demorar alguns minutos. Enviaremos um e-mail quando o processo terminar.',
        align: 'center' as any,
      },
      button: {
        value: 'Ok',
      },
      buttons: {
        primary: <Button onClick={() => onCloseModal()}>Ok</Button>,
        secondary: (
          <Button onClick={() => onCloseModal()} variant="secondary">
            Nova solicitação
          </Button>
        ),
      },
      icon: <SuccessIllustration />,
    };
  };

  useEffect(() => {
    if (onError && dataFiles.length > 0) {
      setDataFiles([{ ...dataFiles[0], status: 'error-send' }]);
    }
  }, [onError]);

  return (
    <div className={styles['uploader__wrapper']}>
      <Modal
        size="default"
        open={isOpen}
        template={getModalTemplate()}
        onBackdropClick={() => onCloseModal()}
        onCloseButtonClick={() => onCloseModal()}
        onClose={() => onCloseModal()}
      />

      <Upload
        fullWidth
        maxFileSize={10}
        multipleFiles={false}
        onCallbackUpload={handleUploadCallBack}
        types={[
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ]}
      />

      <div className={styles['uploader__downloader']}>
        {dataFiles.length === 0 && (
          <LinkButton
            data-testid="download-link"
            label="Baixar planilha modelo"
            icon="download"
            onClick={() =>
              window.open(process.env.NX_FID_MAP_APP_SAMPLE_SHEET_URL, '_blank')
            }
          />
        )}
      </div>
      {dataFiles.length > 0 && (
        <div className={styles['uploader__list']}>
          <UploadListFiles
            title="Status da Importação"
            items={dataFiles}
            onCallbackRemove={handleRemoveFile}
          />

          <Button
            data-testid="btn-send"
            fullWidth
            disabled={
              isOpen || dataFiles[0].status !== 'success' || processId === 0
            }
            onClick={() =>
              processId !== 0 && dataFiles.length > 0 ? fetchUploadFile() : ''
            }
          >
            Solicitar
          </Button>
        </div>
      )}
    </div>
  );
}

export default UploaderFile;
