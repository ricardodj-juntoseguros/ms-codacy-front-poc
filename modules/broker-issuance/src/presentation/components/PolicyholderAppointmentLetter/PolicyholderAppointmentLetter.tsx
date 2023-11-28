import { FunctionComponent } from 'react';

import {
  Alert,
  LinkButton,
  Upload,
  UploadFile,
  UploadListFiles,
} from 'junto-design-system';
import styles from './PolicyholderAppointmentLetter.module.scss';

export interface PolicyholderAppointmentLetterProps {
  file: UploadFile[];
  onUploadFile: (file: UploadFile[]) => void;
  onRemoveFile: (id: string) => void;
}

const PolicyholderAppointmentLetter: FunctionComponent<PolicyholderAppointmentLetterProps> =
  ({ file, onUploadFile, onRemoveFile }) => {
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
    const handleDownloadAppointmentLetterTemplate = () => {
      window.open(
        'https://static.juntoseguros.com/docs/Carta+de+Nomeac%CC%A7a%CC%83o+do+Corretor.docx',
        '_blank',
      );
    };

    return (
      <div className={styles['policyholder-appointment-letter__wrapper']}>
        <Alert
          variant="error"
          icon="x-circle"
          arrow="top-start"
          text="Ops, parece que esse tomador não faz parte da sua carteira. Mas você pode solicitar uma carta de nomeação para ele e enviar para ajustarmos seu cadastro. "
        />
        <div className={styles['policyholder-appointment-letter__upload']}>
          <p className={styles['policyholder-appointment-letter__text']}>
            Já possui uma carta? Envie abaixo ou baixe agora um{' '}
            <LinkButton
              id="policyholderAppointmentLetterProps-button-download-template"
              data-testid="policyholderAppointmentLetterProps-button-download-template"
              label="modelo de carta de nomeação"
              onClick={handleDownloadAppointmentLetterTemplate}
            />
          </p>
          <Upload
            fullWidth
            maxFileSize={8}
            multipleFiles={false}
            types={types}
            showMaxFileSize={false}
            onCallbackUpload={onUploadFile}
          />
          <UploadListFiles items={file} onCallbackRemove={onRemoveFile} />
        </div>
      </div>
    );
  };

export default PolicyholderAppointmentLetter;
