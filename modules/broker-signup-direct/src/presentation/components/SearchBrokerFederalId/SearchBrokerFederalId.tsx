import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { InputBase, Button } from 'junto-design-system';
import { federalIdFormatter } from '../../../helpers';
import styles from './SearchBrokerFederalId.module.scss';
import LoadingSpinner from '../LoadingSpinner';
import SearchBrokerApi from '../../../application/features/searchBroker/SearchBrokerApi';
import CheckSusep from '../../../application/features/Susep/CheckSusep';
import { RegisterBrokerTypeEnum } from '../../../application/types/model';
import {
  SearchRegisterBrokerDTO,
  StatusSusepDTO,
} from '../../../application/types/dto';
import { useAppDispatch } from '../../../config/store';
import {
  brokerInformationSliceActions,
  selectBroker,
} from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { brokerInformationAdapter } from '../../../application/features/brokerInformation/adapters';
import { registerBrokerAdapter } from '../../../application/features/RegisterBroker/adapters/RegisterBrokerAdapter';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';

export interface SearchBrokerFederalIdProps {
  handleGoNextClick(): void;
}

export function SearchBrokerFederalId({
  handleGoNextClick,
}: SearchBrokerFederalIdProps) {
  const brokerInformation = useSelector(selectBroker);
  const [brokerFederalId, setBrokerFederalId] = useState(
    brokerInformation.information.federalId,
  );
  const [statusBrokerRegistry, setStatusBrokerRegistry] =
    useState<SearchRegisterBrokerDTO | null>();
  const [alertText, setAlertText] = useState<string>('');
  const [isDisableButtonSignup, setIsDisableButtonSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusSusep, setStatusSusep] = useState<StatusSusepDTO>();
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useAppDispatch();
  const [hasSusepError, setHasSusepError] = useState(false);

  const fetchStatusBrokerRegistry = useCallback(
    async brokerFederalIdNotMask => {
      setIsSubmitting(true);
      await SearchBrokerApi.searchRegisterBroker(brokerFederalIdNotMask)
        .then(response => {
          setStatusBrokerRegistry(response);
        })
        .catch(() => setIsDisableButtonSignup(false))
        .finally(() => getShowAlert());
      setIsSubmitting(false);
    },
    [statusBrokerRegistry?.status],
  );

  const fetchBrokerStatusSusep = useCallback(async brokerFederalIdNotMask => {
    setIsSubmitting(true);
    await CheckSusep.getStatusSusep(brokerFederalIdNotMask)
      .then(response => {
        setStatusSusep(response);
      })
      .catch(() => getShowAlertErrorSusep())
      .finally(() => fetchStatusBrokerRegistry(brokerFederalIdNotMask));
  }, []);

  const getShowAlertErrorSusep = () => {
    setAlertText(
      'Por favor entre em contato com a regional mais próxima de você.',
    );
    setShowAlert(true);
    setHasSusepError(true);
    setIsDisableButtonSignup(true);
  };

  const getShowAlert = () => {
    const federalId = brokerFederalId.replace(/[^a-zA-Z0-9]/g, '');
    if (!hasSusepError && statusBrokerRegistry?.status !== undefined) {
      if (
        statusSusep?.retorno?.situacao.toUpperCase() === 'ATIVO' &&
        statusBrokerRegistry?.status === RegisterBrokerTypeEnum.REGISTERED &&
        federalId.length === 14
      ) {
        setAlertText('Esse CNPJ já possui cadastro conosco. ');
        setShowAlert(true);
        setIsDisableButtonSignup(true);
        return;
      }
      if (
        statusSusep?.retorno === null &&
        statusBrokerRegistry?.status !== RegisterBrokerTypeEnum.INVALID
      ) {
        setAlertText(
          'Esse CNPJ não é de uma corretora de seguros. Informe o CNPJ de uma corretora para continuar.',
        );
        setShowAlert(true);
        setIsDisableButtonSignup(true);
        return;
      }
      if (statusBrokerRegistry?.status === RegisterBrokerTypeEnum.INVALID) {
        setAlertText('O CNPJ informado não é válido. Revise os dados.');
        setShowAlert(true);
        setIsDisableButtonSignup(true);
        return;
      }
      setIsDisableButtonSignup(false);
      setShowAlert(false);
    }
    setAlertText('');
  };

  useEffect(() => {
    const federalId = brokerFederalId.replace(/[^a-zA-Z0-9]/g, '');
    if (federalId.length >= 14) {
      fetchBrokerStatusSusep(federalId);
    } else {
      setStatusBrokerRegistry(null);
      setIsDisableButtonSignup(true);
      setShowAlert(false);
    }
  }, [brokerFederalId]);

  useEffect(() => {
    const federalId = brokerFederalId.replace(/[^a-zA-Z0-9]/g, '');
    if (federalId.length >= 14) {
      getShowAlert();
    }
  }, [statusBrokerRegistry]);

  const fetchRegisterBroker = useCallback(
    async broker => {
      await RegisterBrokerApi.registerBroker(broker)
        .then(response => {
          dispatch(brokerInformationSliceActions.setpathUpdate(response));
        })
        .catch(() => setIsDisableButtonSignup(true));
    },
    [dispatch],
  );

  const onSubmit = (
    value: SearchRegisterBrokerDTO,
    statusSusep: StatusSusepDTO,
  ) => {
    const broker = brokerInformationAdapter(
      value,
      statusSusep,
      brokerInformation.codeIsValid,
    );
    dispatch(brokerInformationSliceActions.setBrokerInformationModel(broker));
    fetchRegisterBroker(registerBrokerAdapter(broker));
    handleGoNextClick();
  };

  return (
    <div className={styles['search-broker-federalId-wrapper']}>
      <div id="brokerFederalIdSignup-search-input">
        <InputBase
          data-testid="broker-FederalId"
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          value={federalIdFormatter(brokerFederalId)}
          onChange={e => setBrokerFederalId(e.target.value)}
          onBlur={e => setBrokerFederalId(e.target.value)}
          errorMessage={alertText}
        />
      </div>
      {statusBrokerRegistry?.information?.brokerCompanyName && !showAlert && (
        <div
          className={styles['broker-information_wrapper']}
          data-testid="alert-broker-regisry"
        >
          <span className={styles['broker-information_label']}>
            Corretora encontrada
          </span>
          <p className={styles['broker-information_content']}>
            {statusBrokerRegistry?.information?.brokerCompanyName}
          </p>
        </div>
      )}
      <div className={styles['search-broker-federalId-button-finish_wrapper']}>
        <Button
          id="brokerFederalIdSignup-submit-button"
          data-testid="button-start-broker-registry"
          onClick={() =>
            onSubmit(
              statusBrokerRegistry as SearchRegisterBrokerDTO,
              statusSusep as StatusSusepDTO,
            )
          }
          disabled={isDisableButtonSignup}
        >
          {isSubmitting ? ((<LoadingSpinner />) as any) : 'Continuar'}
        </Button>
      </div>
    </div>
  );
}

export default SearchBrokerFederalId;
