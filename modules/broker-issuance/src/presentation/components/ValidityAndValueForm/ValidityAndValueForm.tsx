import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, makeToast } from 'junto-design-system';
import className from 'classnames';
import { GenericComponentProps, useFlow } from '@shared/hooks';
import { downloadFile } from '@shared/utils';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import ValidityFields from '../ValidityFields';
import { DISCLAIMERS, QUOTE_ERROR_FEEDBACKS } from '../../../constants';
import { useQuotation } from '../../hooks';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import SecuredAmountAndPricing from '../SecuredAmountAndPricing';
import styles from './ValidityAndValueForm.module.scss';

const ValidityAndValueForm: React.FC<GenericComponentProps> = ({ name }) => {
  const { advanceStep } = useFlow();
  const createOrUpdateQuote = useQuotation();
  const [loadingDownloadQuote, setLoadingDownloadQuote] =
    useState<boolean>(false);
  const {
    currentQuote,
    loadingQuote,
    hasQuoteChanges,
    isQuoteResume,
    hasQuoteErrors,
    errorMessage,
  } = useSelector(selectQuote);
  const profile = BrokerPlatformAuthService.getUserProfile();

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

  const submitDisabled = useMemo(() => {
    return !currentQuote || hasQuoteChanges || hasQuoteErrors;
  }, [currentQuote, hasQuoteChanges, hasQuoteErrors]);

  const downloadDisabled = useMemo(() => {
    return (
      !currentQuote || !currentQuote.identification.QuotationId || loadingQuote
    );
  }, [currentQuote, loadingQuote]);

  const handleFormSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    advanceStep(name);
  };

  const handleDownloadQuote = () => {
    if (!currentQuote || loadingDownloadQuote) return;
    setLoadingDownloadQuote(true);
    const {
      identification: { QuotationId, NewQuoterId },
    } = currentQuote;
    QuoteApi.getQuotationDocument(QuotationId)
      .then((result: any) => {
        const file = new Blob([result], {
          type: 'application/pdf',
        });
        downloadFile(file, `cotacao-${NewQuoterId}.pdf`, true);
      })
      .catch(error => makeToast('error', error.data.data.message))
      .finally(() => setLoadingDownloadQuote(false));
  };

  const renderQuoteErrorFeedback = () => {
    if (!errorMessage) return null;
    const alertProps = {
      text: isQuoteResume
        ? 'Ops! Parece que tivemos um problema ao recarregar sua proposta. %ACTION_BUTTON%'
        : 'Ops! Parece que tivemos um problema ao gerar a sua cotação. %ACTION_BUTTON%',
      actionButtonText: 'Clique aqui para tentar novamente.',
      onActionButtonClick: () => createOrUpdateQuote() as any,
    };
    const errorWithCustomFeedback = QUOTE_ERROR_FEEDBACKS.find(
      err => err.keyMessage === errorMessage,
    );
    if (errorWithCustomFeedback) {
      alertProps.text = errorWithCustomFeedback.text;
      alertProps.actionButtonText = errorWithCustomFeedback.actionButtonText;
      alertProps.onActionButtonClick =
        errorWithCustomFeedback.onActionButtonClick;
    }
    return (
      <div className={styles['validity-and-value-form__resume-alert']}>
        <Alert fullWidth variant="error" icon="x-circle" {...alertProps} />
      </div>
    );
  };

  return (
    <form
      className={styles['validity-and-value-form__wrapper']}
      onSubmit={e => handleFormSubmit(e)}
    >
      <ValidityFields />
      <SecuredAmountAndPricing />
      {hasQuoteErrors && renderQuoteErrorFeedback()}
      <div className={styles['validity-and-value-form__legal-terms']}>
        <h3 className={styles['validity-and-value-form__legal-terms-title']}>
          <i className="icon icon-alert-circle" />
          Importante
        </h3>
        <p className={styles['validity-and-value-form__legal-terms-content']}>
          {DISCLAIMERS.resolutionCNSP382}
        </p>
      </div>
      <footer
        className={className(styles['validity-and-value-form__footer'], {
          [styles['validity-and-value-form__footer--policyholder']]:
            profile === ProfileEnum.POLICYHOLDER,
        })}
      >
        {profile !== ProfileEnum.POLICYHOLDER && (
          <Button
            data-testid="validityAndValue-button-download"
            type="button"
            variant="secondary"
            fullWidth
            mobileFullWidth
            disabled={downloadDisabled}
            onClick={() => handleDownloadQuote()}
            loading={loadingDownloadQuote}
          >
            Baixar cotação
          </Button>
        )}
        <Button
          data-testid="validityAndValue-button-submit"
          type="submit"
          fullWidth
          mobileFullWidth
          disabled={submitDisabled}
          loading={profile === ProfileEnum.POLICYHOLDER && loadingQuote}
        >
          Continuar
        </Button>
      </footer>
    </form>
  );
};

export default ValidityAndValueForm;
