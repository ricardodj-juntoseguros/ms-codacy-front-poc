/* eslint-disable no-restricted-globals */
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput, ThemeContext, Tooltip } from 'junto-design-system';
import { useCallback, useContext, useRef, useState } from 'react';
import className from 'classnames';
import styles from './BrokerGeneralInformation.module.scss';
import {
  brokerInformationSliceActions,
  selectBroker,
} from '../../../application/features/brokerInformation/BrokerInformationSlice';
import {
  validationActions,
  selectValidation,
} from '../../../application/features/validation/ValidationSlice';

export const BrokerGeneralInformation: React.FC = () => {
  const brokerInformation = useSelector(selectBroker);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const theme = useContext(ThemeContext);
  const { errors } = useSelector(selectValidation);
  const [issValue, setIssValue] = useState(0);

  const helperMessageIss =
    ' Se o valor não for informado, a alíquota máxima (5%) será aplicada, conforme Lei ISS do Simples Nacional.';
  const dispatch = useDispatch();

  const handleIss = (value: number) => {
    dispatch(brokerInformationSliceActions.setIss(value));
    dispatch(validationActions.removeErrorMessage('iss'));
  };

  const validateIss = async () => {
    if (
      (brokerInformation.iss !== null &&
        !isNaN(brokerInformation.iss) &&
        brokerInformation.iss < 2) ||
      (brokerInformation.iss !== null &&
        !isNaN(brokerInformation.iss) &&
        brokerInformation.iss > 5)
    ) {
      dispatch(
        validationActions.setErrorMessages({
          iss: ['O valor deve ser entre 2% e 5%.'],
        }),
      );
    }
  };

  const renderTooltip = useCallback(() => {
    return (
      <>
        <button
          type="button"
          data-testid="broker-general-information-button-tooltip"
          ref={tooltipButtonRef}
          className={styles['broker_general_information-tooltip-button']}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          onClick={() => setTooltipVisible(!tooltipVisible)}
        >
          <i className={className('icon', 'icon-help-circle', styles[theme])} />
        </button>
        <Tooltip
          anchorRef={tooltipButtonRef}
          text="A alíquota do ISS é definida pelo município no qual o prestador de serviços está cadastrado. Por lei, ela não pode ser menos do que 2% e nem mais do que 5% da Nota Fiscal de Serviços Eletrônica (NFS-e) ou do faturamento mensal da empresa."
          visible={tooltipVisible}
          position="top"
        />
      </>
    );
  }, [theme, tooltipVisible]);

  return (
    <div className={styles['broker_general_information_wrapper']}>
      <div className={styles['broker_general_information_header']}>
        <h1>Percentual da alíquota do ISS</h1>
        <div className={styles['broker_general_information_header_tooltip']}>
          {renderTooltip()}
        </div>
      </div>
      <div className={styles['broker_general_information_inputs']}>
        <div
          id="brokerDetails-iss-input"
          className={styles['broker_general_information_field']}
        >
          <NumberInput
            data-testid="broker-iss"
            label="Informe o percentual"
            placeholder="0%"
            type="text"
            suffix="%"
            allowNegative={false}
            decimalScale={1}
            value={
              brokerInformation.iss === 0
                ? parseInt('', 10)
                : brokerInformation.iss
            }
            onChange={e => {
              handleIss(e);
            }}
            errorMessage={errors.iss && errors.iss[0]}
            onBlur={() => validateIss()}
            helperMessage={!errors.iss ? helperMessageIss : ''}
            disabled={!brokerInformation.simplesOptant && issValue !== null}
          />
        </div>
      </div>
    </div>
  );
};

export default BrokerGeneralInformation;
