import { useState,useEffect,useCallback } from 'react';
import { useSelector } from 'react-redux';
import { InputBase, Button, Alert } from 'junto-design-system';
import { federalIdFormatter } from '@shared/utils';
import styles from './SearchBrokerFederalId.module.scss';
import LoadingSpinner from '../LoadingSpinner';
import  SearchBrokerApi   from '../../../application/features/searchBroker/SearchBrokerApi'
import  CheckSusep   from '../../../application/features/Susep/CheckSusep'
import { RegisterBrokerTypeEnum } from '../../../application/types/model';
import { SearchRegisterBrokerDTO,StatusSusepDTO } from '../../../application/types/dto';
import { useAppDispatch } from '../../../config/store';
import { brokerInformationSliceActions,selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { brokerInformationAdapter } from '../../../application/features/brokerInformation/adapters';
import { registerBrokerAdapter } from '../../../application/features/RegisterBroker/adapters/RegisterBrokerAdapter';
import  RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi'

export interface SearchBrokerFederalIdProps {
  handleGoNextClick(): void;
}

export function SearchBrokerFederalId({handleGoNextClick}: SearchBrokerFederalIdProps) {
  const brokerInformation = useSelector(selectBroker);
  const [brokerFederalId, setBrokerFederalId] = useState(brokerInformation.information.federalId);
  const [statusBrokerRegistry, setStatusBrokerRegistry] =useState<SearchRegisterBrokerDTO | null>();
  const [alertText, setAlertText] =useState<string>('');
  const [alertTextActionLabel, setAlertTextActionLabel] =useState<string>('');
  const [isDisableButtonSignup, setIsDisableButtonSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusSusep, setStatusSusep] = useState<StatusSusepDTO>();;
  const [showAlert, setShowAlert] = useState(false);
  const [urlAlert, setUrlAlert] = useState('');
  const dispatch = useAppDispatch();
  const [hasSusepError, setHasSusepError] = useState(false);

  const fetchStatusBrokerRegistry = useCallback(
    async (brokerFederalIdNotMask) => {
      setIsSubmitting(true);
        await SearchBrokerApi.searchRegisterBroker(brokerFederalIdNotMask)
        .then(response => {
          setStatusBrokerRegistry(response);
        })
        .catch(() => setIsDisableButtonSignup(false) )
        .finally(() =>
        statusBrokerRegistry?.status === RegisterBrokerTypeEnum.INVALID ||
        statusBrokerRegistry?.status === RegisterBrokerTypeEnum.REGISTERED ? setIsDisableButtonSignup(true) : setIsDisableButtonSignup(false) );
        setIsSubmitting(false);
      },
    [statusBrokerRegistry?.status],
  );

  const fetchBrokerStatusSusep = useCallback(
    async (brokerFederalIdNotMask) => {
      setIsSubmitting(true);
      await CheckSusep.getStatusSusep(brokerFederalIdNotMask)
       .then(response => {
        setStatusSusep(response);
       })
       .catch(() => getShowAlertErrorSusep() )
       .finally(() => fetchStatusBrokerRegistry(brokerFederalIdNotMask));
      },
    [],
  );

  const getShowAlertErrorSusep = () => {
    setAlertText(' Por favor entre em contato com a regional mais próxima de você. %ACTION_BUTTON% ')
    setAlertTextActionLabel('Encontre-a aqui!')
    setShowAlert(true);
    setHasSusepError(true);
    setIsDisableButtonSignup(true)
    setUrlAlert(`${process.env['NX_GLOBAL_SITE_JUNTO']}/contato`)
  };

  const getShowAlert = () => {
    const federalId = brokerFederalId.replace(/[^a-zA-Z0-9]/g, "");
    if(!hasSusepError){
      if(statusSusep?.retorno?.situacao.toUpperCase() === 'ATIVO' && statusBrokerRegistry?.status  === RegisterBrokerTypeEnum.REGISTERED && federalId.length === 14) {
        setAlertText('Esse CNPJ já possui cadastro conosco. Esqueceu sua senha? %ACTION_BUTTON%')
        setShowAlert(true);
        setUrlAlert(`${process.env['NX_GLOBAL_BROKER_PLATFORM_URL']}/access/forgot-password`)
        setAlertTextActionLabel('Clique aqui')
        setIsDisableButtonSignup(true)
        return;
      }
      if(statusSusep?.retorno?.situacao.toUpperCase() !== 'ATIVO' && statusBrokerRegistry?.status  !== RegisterBrokerTypeEnum.INVALID){
        setAlertText('Ops, parece que esse CNPJ não é de uma corretora de seguros. %ACTION_BUTTON% para acessar sua plataforma')
        setShowAlert(true);
        setUrlAlert(`${process.env['NX_GLOBAL_LOGIN_NOVOS_CLIENTES']}`)
        setAlertTextActionLabel('Clique aqui')
        setIsDisableButtonSignup(true)
        return;
      }
      setShowAlert(false);
    }
  };

  useEffect(() => {
    const federalId = brokerFederalId.replace(/[^a-zA-Z0-9]/g, "");
    if(federalId.length === 14 ){
      fetchBrokerStatusSusep(federalId);
    }
    else{
      setStatusBrokerRegistry(null)
      setIsDisableButtonSignup(true)
      setShowAlert(false)
    }
  }, [brokerFederalId], );

  useEffect(() => {
    const federalId = brokerFederalId.replace(/[^a-zA-Z0-9]/g, "");
    if(federalId.length === 14 ){
    getShowAlert();
    }
    if(statusBrokerRegistry?.status === RegisterBrokerTypeEnum.INVALID || statusBrokerRegistry?.status === RegisterBrokerTypeEnum.REGISTERED){
      setIsDisableButtonSignup(true)
    }
  }, [statusBrokerRegistry], );



  const fetchRegisterBroker = useCallback(
    async (broker) => {
      await  RegisterBrokerApi.registerBroker(broker)
      .then(response => { dispatch(brokerInformationSliceActions.setpathUpdate(response));})
      .catch(() => setIsDisableButtonSignup(true))
    },
    [dispatch],
  );



  const onSubmit = (value: SearchRegisterBrokerDTO) => {
    const broker = brokerInformationAdapter(value);
    dispatch(brokerInformationSliceActions.setBrokerInformationModel(broker));
    fetchRegisterBroker(registerBrokerAdapter(broker));
    handleGoNextClick();
  };



  const getErrorMessage = () => {
    return statusBrokerRegistry?.status  === RegisterBrokerTypeEnum.INVALID ? 'Ops, parece que esse CNPJ não existe.' : undefined;
  };

  return (
    <div>
      <div>
              <InputBase
                data-testid="broker-FederalId"
                label="CNPJ"
                placeholder="CNPJ"
                value={federalIdFormatter(brokerFederalId)}
                onChange={e => setBrokerFederalId(e.target.value)}
                onBlur={e => setBrokerFederalId(e.target.value)}
                errorMessage={getErrorMessage()}
              />
      </div>
      { statusBrokerRegistry?.information?.brokerCompanyName &&
        <div className={styles['broker-information_wrapper']}  data-testid="alert-broker-regisry">
            <span className={styles['broker-information_label']}>Razão Social</span>
            <p className={styles['broker-information_content']}>{statusBrokerRegistry?.information?.brokerCompanyName}</p>
        </div>
      }
        { showAlert &&
              <Alert
                variant="neutral"
                arrow="top-start"
                width={312}
                text={alertText}
                actionButtonText={alertTextActionLabel}
                onActionButtonClick={ () => { window.location.href= urlAlert }}
                />
            }
      <div className={styles['search-broker-federalId-button-finish_wrapper']}>
            <Button
              data-testid="button-start-broker-registry"
              onClick={() => onSubmit(statusBrokerRegistry as SearchRegisterBrokerDTO)}
              disabled={isDisableButtonSignup}
            >
              {isSubmitting
                ? ((<LoadingSpinner />) as any)
                : "Iniciar Cadastro"}
            </Button>
      </div>
    </div>
  );
};


export default SearchBrokerFederalId;
