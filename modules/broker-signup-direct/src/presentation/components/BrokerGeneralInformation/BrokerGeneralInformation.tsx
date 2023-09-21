import { useDispatch, useSelector } from 'react-redux';
import { codSusepFormatter } from '@shared/utils';
import { InputBase, Toggle, NumberInput } from 'junto-design-system';
import styles from './BrokerGeneralInformation.module.scss';
import { brokerInformationSliceActions,selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { validationActions, selectValidation } from '../../../application/features/validation/ValidationSlice';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';

export const BrokerGeneralInformation: React.FC = () => {
  const brokerInformation = useSelector(selectBroker);
  const { errors } = useSelector(selectValidation);
  const dispatch = useDispatch();

  const handleCodSusep = (value: string) => {
    dispatch(validationActions.removeErrorMessage('codSusep'));
     dispatch(brokerInformationSliceActions.setCodSusep(value))
  };
  const handleIss = (value: number) => {
    dispatch(brokerInformationSliceActions.setIss(value))
  };

  const handleToggleBrokerSimple = () => {
    dispatch(brokerInformationSliceActions.setSimplesOptant(!brokerInformation.simplesOptant))
  };

  const validate = (input: string,valueInput: string) => {
    if(valueInput === ""){
      dispatch(validationActions.setErrorMessages({[input]: [VALIDATION_MESSAGES.required]}),
      );
    }
  }


  return (
    <div className={styles['broker_general_information_wrapper']}>
    <h1>Informações gerais</h1>
      <div className={styles['broker_general_information_inputs']}>
      <div className={styles['broker_general_information_field']}>
      <InputBase
                data-testid="cod-susep"
                label="Código SUSEP"
                placeholder="Código SUSEP"
                value={brokerInformation.susepCode}
                onChange={e => {handleCodSusep(codSusepFormatter(e.target.value))}}
                onBlur={() => validate('codSusep',brokerInformation.susepCode)}
                errorMessage={errors.codSusep && errors.codSusep[0]}
                disabled
      />
      </div>
      <div className={styles['broker_general_information_field']}>
        <NumberInput
              data-testid="broker-iss"
              label="Percentual ISS - opcional"
              placeholder="Percentual ISS - opcional"
              type="text"
              allowNegative={false}
              decimalScale={2}
              value={brokerInformation.iss === 0 ? parseInt('', 10) : brokerInformation.iss}
              onChange={e => {handleIss(e)}}
          />
      </div>
      <div className={styles['broker_general_information_field_toogle']}>
        <Toggle
            data-testid="broker-simplesOptant"
            name="policyInProgess"
            label="Corretora optante do simples"
            checked={brokerInformation.simplesOptant}
            onChange={handleToggleBrokerSimple}
          />
        </div>
      </div>
    </div>
  );
};

export default BrokerGeneralInformation;
