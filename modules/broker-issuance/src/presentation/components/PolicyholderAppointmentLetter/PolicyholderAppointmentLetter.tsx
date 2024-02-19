import { FunctionComponent, useCallback, useState } from 'react';

import {
  Alert,
  Button,
  LinkButton,
  Upload,
  UploadFile,
  UploadListFiles,
  makeToast,
} from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BrokerPlatformAuthService } from '@services';
import { FILE_TYPES } from '../../../constants';
import {
  policyholderSelectionActions,
  selectPolicyholder,
} from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import handleError from '../../../helpers/handlerError';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import styles from './PolicyholderAppointmentLetter.module.scss';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';

const PolicyholderAppointmentLetter: FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { policyholderSearchValue } = useSelector(selectPolicyholder);
  const { setCurrentAppointmentLetter, clearPolicyholderSelection } =
    policyholderSelectionActions;
  const { setPolicyholder } = quoteSliceActions;
  const [appointmentLetter, setAppointmentLetter] = useState<UploadFile[]>([]);
  const [uploadAppointmentLetterLoading, setUploadAppointmentLetterLoading] =
    useState(false);

  const handleUploadFile = (files: UploadFile[]) => {
    setAppointmentLetter(files);
    const { file } = files[0];
    dispatch(
      setCurrentAppointmentLetter({
        filename: file.name,
        size: file.size,
      }),
    );
  };

  const handleRemoveFile = (id: string) => {
    setAppointmentLetter(prev => prev.filter(item => item.id !== id));
    dispatch(setCurrentAppointmentLetter(null));
  };

  const handleButtonClick = () => {
    if (uploadAppointmentLetterLoading) return;
    handleUploadAppointmentLetter();
  };

  const handleUploadAppointmentLetter = useCallback(async () => {
    setUploadAppointmentLetterLoading(true);
    const broker = BrokerPlatformAuthService.getBroker();
    if (!broker || !broker.externalId) {
      return;
    }
    setUploadAppointmentLetterLoading(true);
    await PolicyholderSelectionApi.postAppointmentLetter(
      policyholderSearchValue.replace(/[^\d]/g, ''),
      broker.externalId,
      appointmentLetter[0].file,
    )
      .then(() => {
        dispatch(clearPolicyholderSelection());
        dispatch(setPolicyholder(null));
        history.push('/appointment-sent');
      })
      .catch(error => {
        const message = handleError(error);
        makeToast('error', message);
      })
      .finally(() => setUploadAppointmentLetterLoading(false));
  }, [
    setPolicyholder,
    appointmentLetter,
    clearPolicyholderSelection,
    dispatch,
    history,
    policyholderSearchValue,
  ]);

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
            id="policyholderAppointmentLetter-button-download-template"
            data-testid="policyholderAppointmentLetter-button-download-template"
            label="modelo de carta de nomeação"
            onClick={handleDownloadAppointmentLetterTemplate}
          />
        </p>
        <Upload
          fullWidth
          maxFileSize={8}
          multipleFiles={false}
          types={FILE_TYPES.default}
          showMaxFileSize={false}
          onCallbackUpload={handleUploadFile}
        />
        <UploadListFiles
          items={appointmentLetter}
          onCallbackRemove={handleRemoveFile}
        />
      </div>
      <div className={styles['policyholder-appointment-letter__submit']}>
        <Button
          id="policyholderAppointmentLetter-submit-button"
          data-testid="policyholderAppointmentLetter-submit-button"
          type="button"
          onClick={() => handleButtonClick()}
          disabled={appointmentLetter.length === 0}
          loading={uploadAppointmentLetterLoading}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default PolicyholderAppointmentLetter;
