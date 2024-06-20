import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { useFlow } from '@shared/hooks';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { selectPolicyRenewal } from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import { useQuotation } from '../../hooks';
import styles from './PolicyholderAndModalityFormWrapper.module.scss';

interface PolicyholderAndModalityFormWrapperProps {
  name: string;
}

const PolicyholderAndModalityFormWrapper: FunctionComponent<PolicyholderAndModalityFormWrapperProps> =
  ({ name, children }) => {
    const { advanceStep } = useFlow();
    const { loadingQuote, currentQuote, hasQuoteChanges } =
      useSelector(selectQuote);
    const { hasPolicyRenewalChanges } = useSelector(selectPolicyRenewal);
    const createOrUpdateQuote = useQuotation();

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (loadingQuote) return;
      if (
        currentQuote &&
        currentQuote.pricing &&
        (hasQuoteChanges || hasPolicyRenewalChanges)
      ) {
        createOrUpdateQuote(false, name);
        return;
      }
      advanceStep(name);
    };

    return (
      <form
        id="policyholderAndModalityForm"
        data-testid="policyholderAndModalityForm"
        className={styles['policyholder-and-modality-form__wrapper']}
        onSubmit={e => handleSubmit(e)}
      >
        {children}
      </form>
    );
  };

export default PolicyholderAndModalityFormWrapper;
