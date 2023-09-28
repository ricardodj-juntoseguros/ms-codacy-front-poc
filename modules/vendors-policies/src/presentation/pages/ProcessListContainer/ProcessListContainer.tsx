import { useContext} from 'react';
import classnames from 'classnames';
import { ThemeContext } from 'junto-design-system';
import { UserTypeEnum, VendorsAuthService } from '@services';

import styles from './ProcessListContainer.module.scss';
import ProcessList from '../../components/ProcessList';
import ProcessListFooter from '../../components/ProcessListFooter';

function ProcessListContainer() {
  const theme = useContext(ThemeContext);

  const renderNewProposalButton = () => {
    const userType = VendorsAuthService.getUserType();
    if (userType === UserTypeEnum.INSURED) {
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
      case UserTypeEnum.INSURED:
      case UserTypeEnum.BROKER:
        return `acompanhe aqui seus contratos e garantias`;
      case UserTypeEnum.POLICYHOLDER:
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
      <ProcessList />
      <ProcessListFooter />
    </section>
  );
}

export default ProcessListContainer;
