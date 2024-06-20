import { FunctionComponent, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'junto-design-system';
import { PolicyRenewalTypeEnum } from '../../../application/types/model';
import { selectPolicyRenewal } from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { POLICY_NUMBER_MAX_LENGTH } from '../../../constants';
import styles from './PolicyholderAndModalityFooter.module.scss';

const PolicyholderAndModalityFooter: FunctionComponent = () => {
  const { policyholder, modality, loadingQuote } = useSelector(selectQuote);
  const {
    verifyPolicyLoading,
    verifyErrorMessage,
    needEndorsement,
    policyRenewalType,
    mainPolicyNumber,
    isPolicyRenewal,
  } = useSelector(selectPolicyRenewal);

  const disabledSubmitButton = useMemo(() => {
    return (
      !policyholder ||
      !modality ||
      verifyPolicyLoading ||
      verifyErrorMessage.length !== 0 ||
      needEndorsement ||
      (isPolicyRenewal &&
        policyRenewalType === PolicyRenewalTypeEnum.Undefined) ||
      (policyRenewalType === PolicyRenewalTypeEnum.BelongsToOurCompany &&
        mainPolicyNumber.length < POLICY_NUMBER_MAX_LENGTH)
    );
  }, [
    isPolicyRenewal,
    mainPolicyNumber,
    modality,
    needEndorsement,
    policyRenewalType,
    policyholder,
    verifyErrorMessage,
    verifyPolicyLoading,
  ]);

  return (
    <footer className={styles['policyholder-and-modality-footer__wrapper']}>
      <Button
        id="policyholderAndModality-submit-button"
        data-testid="policyholderAndModality-submit-button"
        type="submit"
        disabled={disabledSubmitButton}
        loading={loadingQuote}
      >
        Continuar
      </Button>
    </footer>
  );
};

export default PolicyholderAndModalityFooter;
