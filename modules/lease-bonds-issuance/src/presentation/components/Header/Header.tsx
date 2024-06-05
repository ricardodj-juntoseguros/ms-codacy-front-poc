import { FunctionComponent, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LinkButton } from 'junto-design-system';
import { JuntoLogoDark } from '@shared/ui';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import styles from './Header.module.scss';

const Header: FunctionComponent = () => {
  const { identification } = useSelector(selectProposal);
  const { currentQuote } = useSelector(selectQuote);

  const handleGoToProcessList = () => {
    window.location.assign(process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '');
  };

  const label = useMemo(() => {
    if (identification) return `Proposta Nº ${identification.PolicyId}`;
    if (currentQuote)
      return `Cotação Nº ${currentQuote.identification.NewQuoterId}`;
    return 'Nova cotação fiança locatícia';
  }, [currentQuote, identification]);

  return (
    <header className={styles['header__wrapper']}>
      <div className={styles['header__logo']}>
        <JuntoLogoDark />
      </div>
      <div className={styles['header__go-back-wrapper']}>
        <LinkButton
          label="Ir para home"
          icon="arrow-left"
          onClick={() => handleGoToProcessList()}
        />
      </div>
      <h1 className={styles['header__title']}>{label}</h1>
    </header>
  );
};

export default Header;
