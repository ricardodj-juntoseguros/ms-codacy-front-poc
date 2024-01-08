/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useLayoutEffect } from 'react';
import { Button } from 'junto-design-system';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { ReactComponent as WarningIcon } from '../../assets/warning-icon.svg';

import styles from './FinancialPendingContainer.module.scss';

const FinancialPendingContainer: FunctionComponent = () => {
  const { currentQuote, policyholder } = useSelector(selectQuote);
  const { identification, hasOnlyFinancialPending } =
    useSelector(selectProposal);
  const history = useHistory();

  useLayoutEffect(() => {
    if (!currentQuote || !identification || !hasOnlyFinancialPending) {
      history.push('');
    }
  }, []);

  const handleRedirectToBills = () => {
    window.open(
      `${process.env.NX_GLOBAL_BILLS_PLATFORM}?cnpj=${policyholder?.federalId}&status=vencido`,
      '_blank',
    );
  };

  return (
    <section className={styles['financial-pending-container__wrapper']}>
      <div className={styles['financial-pending-container__content']}>
        <WarningIcon />
        <h1 className={styles['financial-pending-container__title']}>
          A proposta está pronta para ser emitida, porém o tomador possui
          boleto(s) vencido(s)
        </h1>
        <p className={styles['financial-pending-container__text']}>
          Para prorrogar ou fazer download da 2ª via acesse a área de boletos
          clicando no botão abaixo. E lembre-se de retomar a proposta para
          finalizar a emissão depois de resolvida a pendência.
        </p>
        <Button
          id="financialPendingContainer-button-redirect-to-bills"
          data-testid="financialPendingContainer-button-redirect-to-bills"
          type="button"
          onClick={() => handleRedirectToBills()}
        >
          Ir para seus boletos
        </Button>
        <span className={styles['financial-pending-container__help-text']}>
          Caso precise de ajuda ou tenha alguma dúvida, entre em contato com sua
          regional.
        </span>
      </div>
    </section>
  );
};

export default FinancialPendingContainer;
