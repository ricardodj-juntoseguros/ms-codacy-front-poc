import { useContext } from 'react';
import classnames from 'classnames';
import { ThemeContext } from 'junto-design-system';
import { VendorsAuthService } from '@services';
import styles from './ProcessListContainer.module.scss';

function ProcessListContainer() {
  const theme = useContext(ThemeContext);

  const renderNewProposalButton = () => {
    const userType = VendorsAuthService.getUserType();
    if (userType === 'insured') {
      return (
        <button
          data-testid="processListContainer-button-new-proposal"
          className={classnames(
            styles['process-list-container__new-proposal-button'],
            styles[theme],
          )}
          type="button"
          onClick={() => window.location.assign('/proposal')}
        >
          <i className="icon-plus" />
          Solicitar garantia
        </button>
      );
    }
    return null;
  };

  const getGreetingAuxText = () => {
    const userType = VendorsAuthService.getUserType();
    switch (userType) {
      case 'insured':
      case 'broker':
        return `acompanhe aqui seus contratos e garantias`;
      case 'policyholder':
        return `acompanhe aqui suas oportunidades de negócio`;
      default:
        return '';
    }
  };

  return (
    <section className={styles['process-list-container__wrapper']}>
      <h1
        className={classnames(
          styles['process-list-container__greeting'],
          styles[theme],
        )}
      >
        {`Olá, ${VendorsAuthService.getUsername()}`}
      </h1>
      <h1
        className={classnames(
          styles['process-list-container__greeting'],
          styles[theme],
        )}
      >
        {getGreetingAuxText()}
      </h1>
      {renderNewProposalButton()}
    </section>
  );
}

export default ProcessListContainer;
