import { FunctionComponent, useCallback, useRef, useState } from 'react';
import {
  Button,
  InputBase,
  RadioButton,
  RadioGroup,
  Toggle,
  Tooltip,
} from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { policyNumberFormatter } from '@shared/utils';
import { useDebounce } from '@shared/hooks';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import {
  policyRenewalActions,
  selectPolicyRenewal,
  verifyPolicy,
} from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import { PolicyRenewalTypeEnum } from '../../../application/types/model';
import { DISCLAIMERS, POLICY_NUMBER_MAX_LENGTH } from '../../../constants';
import styles from './PolicyRenewal.module.scss';

const PolicyRenewal: FunctionComponent = () => {
  const [policyInProgressTooltipVisible, setPolicyInProgressTooltipVisible] =
    useState(false);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();
  const {
    isPolicyRenewal,
    mainPolicyNumber,
    policyRenewalType,
    documentNumber,
    verifyErrorMessage,
    needEndorsement,
    verifyPolicyLoading,
  } = useSelector(selectPolicyRenewal);
  const { policyholder } = useSelector(selectQuote);
  const { setIsPolicyRenewal, setMainPolicyNumber, setPolicyRenewalType } =
    policyRenewalActions;

  useDebounce(() => handleVerifyPolicy(), 500, [
    mainPolicyNumber,
    policyholder,
  ]);

  const handleVerifyPolicy = useCallback(async () => {
    if (mainPolicyNumber.length !== POLICY_NUMBER_MAX_LENGTH || !policyholder) {
      return;
    }
    await dispatch(
      verifyPolicy({ mainPolicyNumber, policyholderId: policyholder.id }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainPolicyNumber, policyholder]);

  const handleToggleIsPolicyRenewal = () => {
    dispatch(setIsPolicyRenewal(!isPolicyRenewal));
  };

  const handleSetPolicyRenewalType = (type: PolicyRenewalTypeEnum) => {
    dispatch(setPolicyRenewalType(type));
  };

  const handleSetMainPolicyNumber = (value: string) => {
    const formattedValue = policyNumberFormatter(value);
    dispatch(setMainPolicyNumber(formattedValue));
  };

  const handleRedirectToEndorsement = () => {
    window.open(
      `${process.env.NX_GLOBAL_ENDORSEMENT_URL}/search?documentNumber=${documentNumber}`,
      '_blank',
    );
  };

  const renderPolicyRenewalOptions = () => {
    if (!isPolicyRenewal) return null;
    return (
      <RadioGroup
        name="policyRenewalType"
        onChange={value =>
          handleSetPolicyRenewalType(Number(value) as PolicyRenewalTypeEnum)
        }
        value={policyRenewalType.toString()}
      >
        <div className={styles['policy-renewal__options']}>
          <p className={styles['policy-renewal__title']}>
            Selecione a opção adequada para a proposta:
          </p>
          <RadioButton
            id="policyRenewal-onGoingProcess-radio-button"
            data-testid="policyRenewal-onGoingProcess-radio-button"
            value={PolicyRenewalTypeEnum.OnGoingProcess.toString()}
            label="Contrato em andamento (renovação através de aditivo e/ou outros documentos)"
          />
          <RadioButton
            id="policyRenewal-belongsToAnotherInsuranceCompany-radio-button"
            data-testid="policyRenewal-belongsToAnotherInsuranceCompany-radio-button"
            value={PolicyRenewalTypeEnum.BelongsToAnotherInsuranceCompany.toString()}
            label="Renovação a partir de outra seguradora ou outra forma de caução"
          />
          <RadioButton
            id="policyRenewal-belongsToOurCompany-radio-button"
            data-testid="policyRenewal-belongsToOurCompany-radio-button"
            value={PolicyRenewalTypeEnum.BelongsToOurCompany.toString()}
            label="Renovação de apólice da Junto Seguros"
          />
        </div>
      </RadioGroup>
    );
  };

  const renderMainPolicyNumber = () => {
    if (policyRenewalType !== PolicyRenewalTypeEnum.BelongsToOurCompany)
      return null;
    return (
      <div className={styles['policy-renewal__main-policy-number']}>
        <p className={styles['policy-renewal__title']}>
          Informe o número da apólice mãe na Junto
        </p>
        <InputBase
          id="policyRenewal-policyNumber-input"
          data-testid="policyRenewal-policyNumber-input"
          label="Nº apólice mãe"
          placeholder=" "
          name="policyNumber"
          value={mainPolicyNumber}
          onChange={e => handleSetMainPolicyNumber(e.target.value)}
          errorMessage={verifyErrorMessage}
          loading={verifyPolicyLoading}
          maxLength={15}
        />
        {needEndorsement && (
          <Button
            id="policyRenewal-startEndorsement-button"
            data-testid="policyRenewal-startEndorsement-button"
            type="button"
            size="medium"
            onClick={() => handleRedirectToEndorsement()}
            disabled={verifyPolicyLoading}
          >
            Iniciar um endosso
          </Button>
        )}
      </div>
    );
  };

  return (
    <section className={styles['policy-renewal__wrapper']}>
      <div className={styles['policy-renewal__toggle']}>
        <Toggle
          id="policyRenewal-toggle-show"
          data-testid="policyRenewal-toggle-show"
          label="Essa proposta é uma renovação de garantia ou um contrato que já esta em andamento"
          name="policyRenewal-toggle-show"
          checked={isPolicyRenewal}
          disabled={!policyholder}
          onChange={() => handleToggleIsPolicyRenewal()}
        />
        <button
          id="policyRenewal-tooltip"
          data-testid="policyRenewal-tooltip"
          ref={tooltipButtonRef}
          type="button"
          className={styles['policy-renewal__tooltip']}
          onMouseEnter={() => setPolicyInProgressTooltipVisible(true)}
          onMouseLeave={() => setPolicyInProgressTooltipVisible(false)}
        >
          <i className="icon-info" />
        </button>
        <Tooltip
          anchorRef={tooltipButtonRef}
          text={DISCLAIMERS.policyRenewal}
          visible={policyInProgressTooltipVisible}
          position="top"
        />
      </div>
      {renderPolicyRenewalOptions()}
      {renderMainPolicyNumber()}
    </section>
  );
};

export default PolicyRenewal;
