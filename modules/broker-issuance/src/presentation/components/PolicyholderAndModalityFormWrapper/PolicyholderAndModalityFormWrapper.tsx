import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { useFlow } from '@shared/hooks';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import styles from './PolicyholderAndModalityFormWrapper.module.scss';

interface PolicyholderAndModalityFormWrapperProps {
  name: string;
}

const PolicyholderAndModalityFormWrapper: FunctionComponent<PolicyholderAndModalityFormWrapperProps> =
  ({ name, children }) => {
    const { advanceStep } = useFlow();
    const { loadingQuote } = useSelector(selectQuote);

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (loadingQuote) return;
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
