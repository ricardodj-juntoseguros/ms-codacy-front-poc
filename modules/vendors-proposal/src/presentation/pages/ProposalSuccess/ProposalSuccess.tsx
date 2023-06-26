/* eslint-disable consistent-return */
import { Button, ThemeContext } from 'junto-design-system';
import { useContext, useLayoutEffect } from 'react';
import className from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { REDIRECT_URLS } from '../../../constants';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import styles from './ProposalSuccess.module.scss';

const ProposalSuccess: React.FunctionComponent = () => {
  const theme = useContext(ThemeContext);
  const history = useHistory();
  const { identification } = useSelector(selectProposal);

  useLayoutEffect(() => {
    if (!identification?.proposalId || !identification?.policyId)
      history.push('/');
  }, [history, identification?.policyId, identification?.proposalId]);

  const handleGoHome = () => window.location.assign(REDIRECT_URLS.policies);

  return (
    <section
      className={className(styles['proposal-success__wrapper'], styles[theme])}
    >
      <i className={className('icon', 'icon-check', styles[theme])} />
      <h1
        className={className(styles['proposal-success__title'], styles[theme])}
      >
        Solicitação realizada! Fique de olho, entraremos em contato com você.
      </h1>
      <p className={className(styles['proposal-success__text'], styles[theme])}>
        Você receberá um e-mail quando houver alguma evolução nesta sua
        solicitação.
      </p>
      <div className={styles['proposal-success__button']}>
        <Button
          type="button"
          fullWidth
          data-testid="proposalSuccess-button-go-home"
          onClick={() => handleGoHome()}
        >
          Acessar meu painel
        </Button>
      </div>
    </section>
  );
};

export default ProposalSuccess;
