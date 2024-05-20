import { FunctionComponent, useMemo, useState } from 'react';
import { Button, makeToast } from 'junto-design-system';
import { useSelector } from 'react-redux';
import className from 'classnames';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { downloadFile } from '@shared/utils';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import styles from './ValidityAndValueFooter.module.scss';

const ValidityAndValueFooter: FunctionComponent = () => {
  const [loadingDownloadQuote, setLoadingDownloadQuote] =
    useState<boolean>(false);
  const { currentQuote, loadingQuote, hasQuoteChanges, hasQuoteErrors } =
    useSelector(selectQuote);
  const profile = BrokerPlatformAuthService.getUserProfile();

  const submitDisabled = useMemo(() => {
    return !currentQuote || hasQuoteChanges || hasQuoteErrors;
  }, [currentQuote, hasQuoteChanges, hasQuoteErrors]);

  const downloadDisabled = useMemo(() => {
    return (
      !currentQuote || !currentQuote.identification.QuotationId || loadingQuote
    );
  }, [currentQuote, loadingQuote]);

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
    <footer
      className={className(styles['validity-and-value-footer__wrapper'], {
        [styles['validity-and-value-footer__wrapper--policyholder']]:
          profile !== ProfileEnum.POLICYHOLDER,
      })}
    >
      {profile !== ProfileEnum.POLICYHOLDER && (
        <Button
          id="validityAndValueFooter-button-download"
          data-testid="validityAndValueFooter-button-download"
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
        id="validityAndValueFooter-button-submit"
        data-testid="validityAndValueFooter-button-submit"
        type="submit"
        fullWidth
        mobileFullWidth
        disabled={submitDisabled}
        loading={profile === ProfileEnum.POLICYHOLDER && loadingQuote}
      >
        Continuar
      </Button>
    </footer>
  );
};

export default ValidityAndValueFooter;
