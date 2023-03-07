import { useState,useEffect,useCallback } from 'react';
import { InputBase, Button, Alert } from 'junto-design-system';
import { federalIdFormatter } from '@shared/utils';
import styles from './SearchBrokerFederalId.module.scss';
import LoadingSpinner from '../LoadingSpinner';
import  SearchBrokerApi   from '../../../application/features/searchBroker/SearchBrokerApi'
import { RegisterBrokerTypeEnum } from '../../../application/types/model';
import { SearchRegisterBrokerDTO } from '../../../application/types/dto';

export const SearchBrokerFederalId: React.FC = () => {
  const [brokerFederalId, setBrokerFederalId] = useState("");
  const [isDisableButtonSignup, setIsDisableButtonSignup] = useState(true);
  const [statusBrokerRegistry, setStatusBrokerRegistry] =useState<SearchRegisterBrokerDTO>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStatusBrokerRegistry = useCallback(
    async (brokerFederalIdNotMask) => {
      await SearchBrokerApi.searchRegisterBroker(brokerFederalIdNotMask)
       .then(response => {
         setStatusBrokerRegistry(response);
       })
       .catch(() => console.log(''))
       .finally(() => setIsDisableButtonSignup(false));
    },
    [],
  );

  useEffect(() => {
    const brokerFederalIdNotMask= brokerFederalId.replace(/[./-]/g, '');

    if(brokerFederalIdNotMask.length === 14 ){
      fetchStatusBrokerRegistry(brokerFederalIdNotMask);
    }
    else{
      setIsDisableButtonSignup(true)
    }
  }, [brokerFederalId]);



  const onSubmit = () => {
    setIsSubmitting(true)
  };

  const showAlert = () => {
    if(statusBrokerRegistry?.status  === RegisterBrokerTypeEnum.REGISTERED && brokerFederalId.length === 18) {
      return true;
    }
    return false;
  };

  const getErrorMessage = () => {
    return statusBrokerRegistry?.status    === RegisterBrokerTypeEnum.INVALID ? 'Ops, parece que esse CNPJ não existe.' : undefined;
  };

  return (
    <div>
      <div>
              <InputBase
                data-testid="broker-FederalId"
                label="CNPJ"
                placeholder="CNPJ"
                value={brokerFederalId}
                onChange={e => setBrokerFederalId(federalIdFormatter(e.target.value))}
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
              onClick={() => onSubmit()}
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
