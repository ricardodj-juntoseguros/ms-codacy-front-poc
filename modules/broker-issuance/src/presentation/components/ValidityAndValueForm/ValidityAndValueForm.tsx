import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, makeToast } from 'junto-design-system';
import { GenericComponentProps, useFlow } from '@shared/hooks';
import { downloadFile } from '@shared/utils';
import ValidityFields from '../ValidityFields';
import { DISCLAIMERS } from '../../../constants';
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
  const { currentQuote, loadingQuote, hasQuoteChanges, isQuoteResume } =
    useSelector(selectQuote);

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
    return !currentQuote || hasQuoteChanges;
  }, [currentQuote, hasQuoteChanges]);

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

  return (
    <form
      className={styles['validity-and-value-form__wrapper']}
      onSubmit={e => handleFormSubmit(e)}
    >
      <ValidityFields />
      <SecuredAmountAndPricing />
      <div className={styles['validity-and-value-form__legal-terms']}>
        <h3 className={styles['validity-and-value-form__legal-terms-title']}>
          <i className="icon icon-alert-circle" />
          Importante
        </h3>
        <p className={styles['validity-and-value-form__legal-terms-content']}>
          {DISCLAIMERS.resolutionCNSP382}
        </p>
      </div>
      <footer className={styles['validity-and-value-form__footer']}>
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
        <Button
          data-testid="validityAndValue-button-submit"
          type="submit"
          fullWidth
          mobileFullWidth
          disabled={submitDisabled}
        >
          Continuar
        </Button>
      </footer>
    </form>
  );
};

export default ValidityAndValueForm;
