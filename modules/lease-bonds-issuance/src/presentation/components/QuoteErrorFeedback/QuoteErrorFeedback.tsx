import { Alert } from 'junto-design-system';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { QUOTE_ERROR_FEEDBACKS } from '../../../constants';
import { useQuotation } from '../../hooks';
import styles from './QuoteErrorFeedback.module.scss';

const QuoteErrorFeedback: FunctionComponent = () => {
  const { isQuoteResume, errorMessage } = useSelector(selectQuote);
  const createOrUpdateQuote = useQuotation();

  const renderQuoteErrorFeedback = () => {
    if (!errorMessage) return null;
    let alertProps = {
      text: isQuoteResume
        ? 'Ops! Parece que tivemos um problema ao recarregar sua proposta. %ACTION_BUTTON%'
        : 'Ops! Parece que tivemos um problema ao gerar a sua cotação. %ACTION_BUTTON%',
      actionButtonText: 'Clique aqui para tentar novamente.',
      onActionButtonClick: () => createOrUpdateQuote() as any,
    };
    const errorWithCustomFeedback = QUOTE_ERROR_FEEDBACKS.find(
      err => err.keyMessage === errorMessage,
    );
    if (errorWithCustomFeedback) alertProps = errorWithCustomFeedback;
    return (
      <div className={styles['quote-error-feedback__wrapper']}>
        <Alert fullWidth variant="error" icon="x-circle" {...alertProps} />
      </div>
    );
  };

  return renderQuoteErrorFeedback();
};

export default QuoteErrorFeedback;
