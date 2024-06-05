import { FunctionComponent, useEffect } from 'react';
import { useFlow } from '@shared/hooks';
import { useSelector } from 'react-redux';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { useQuotation } from '../../hooks';
import styles from './ValidityAndValueFormWrapper.module.scss';

interface ValidityAndValueFormWrapperProps {
  name: string;
}

const ValidityAndValueFormWrapper: FunctionComponent<ValidityAndValueFormWrapperProps> =
  ({ name, children }) => {
    const { advanceStep } = useFlow();
    const { currentQuote, isQuoteResume } = useSelector(selectQuote);
    const createOrUpdateQuote = useQuotation();

    useEffect(() => {
      if (
        isQuoteResume &&
        currentQuote &&
        currentQuote.identification &&
        !currentQuote.totalPrize
      ) {
        createOrUpdateQuote();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isQuoteResume, currentQuote]);

    const handleFormSubmit = (evt: React.FormEvent) => {
      evt.preventDefault();
      advanceStep(name);
    };

    return (
      <form
        className={styles['validity-and-value-form__wrapper']}
        onSubmit={e => handleFormSubmit(e)}
      >
        {children}
      </form>
    );
  };

export default ValidityAndValueFormWrapper;
