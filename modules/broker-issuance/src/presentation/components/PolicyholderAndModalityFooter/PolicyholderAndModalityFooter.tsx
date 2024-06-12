import { FunctionComponent, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'junto-design-system';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import styles from './PolicyholderAndModalityFooter.module.scss';

const PolicyholderAndModalityFooter: FunctionComponent = () => {
  const { policyholder, modality, loadingQuote } = useSelector(selectQuote);

  const disabledSubmitButton = useMemo(() => {
    return !policyholder || !modality;
  }, [modality, policyholder]);

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
