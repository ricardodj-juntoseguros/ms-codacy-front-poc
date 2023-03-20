import { useState,useEffect,useCallback } from 'react';
import { useSelector } from 'react-redux';
import { InputBase, Button, Alert } from 'junto-design-system';
import { federalIdFormatter } from '@shared/utils';
import styles from './SearchBrokerFederalId.module.scss';
import LoadingSpinner from '../LoadingSpinner';
import  SearchBrokerApi   from '../../../application/features/searchBroker/SearchBrokerApi'
import { RegisterBrokerTypeEnum } from '../../../application/types/model';
import { SearchRegisterBrokerDTO } from '../../../application/types/dto';
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
  const [statusBrokerRegistry, setStatusBrokerRegistry] =useState<SearchRegisterBrokerDTO>();
  const [isDisableButtonSignup, setIsDisableButtonSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();


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
       setIsSubmitting(false)
      },
    [statusBrokerRegistry?.status],
  );

  useEffect(() => {
    if(brokerFederalId.length === 14 ){
      fetchStatusBrokerRegistry(brokerFederalId);
    }
    else{
      setIsDisableButtonSignup(true)
    }
  }, [brokerFederalId, fetchStatusBrokerRegistry], );

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

  const showAlert = () => {
    if(statusBrokerRegistry?.status  === RegisterBrokerTypeEnum.REGISTERED && brokerFederalId.length === 14) {
      return true;
    }
    return false;
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
                errorMessage={getErrorMessage()}
              />
      </div>
      { statusBrokerRegistry?.information?.razao_social &&
        <div className={styles['broker-information_wrapper']}  data-testid="alert-broker-regisry">
            <span className={styles['broker-information_label']}>Razão Social</span>
            <p className={styles['broker-information_content']}>{statusBrokerRegistry?.information?.razao_social}</p>
            { showAlert() &&
              <Alert
                variant="neutral"
                arrow="top-start"
                width={312}
                text="Esse CNPJ já possui cadastro conosco. Esqueceu sua senha? %ACTION_BUTTON%"
                actionButtonText="Clique aqui"
                onActionButtonClick={ () => { window.location.href= `${process.env['NX_GLOBAL_BROKER_PLATFORM_URL']}/access/forgot-password`}}
                />
            }
        </div>
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
