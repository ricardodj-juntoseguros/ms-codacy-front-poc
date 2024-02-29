import { FunctionComponent } from 'react';
import { LinkButton } from 'junto-design-system';
import { redirectIncentiveTrailTerms } from '../../../helpers';
import styles from './IncentiveTrailHeader.module.scss';

const IncentiveTrailHeader: FunctionComponent = () => {
  return (
    <header className={styles['incentive-trail-header__wrapper']}>
      <img
        src="https://static.juntoseguros.com/images/trilha-de-incentivo-logo.svg"
        alt="Logo da campanha da trilha de incentivo"
      />
      <LinkButton
        id="incentiveTrailHeader-linkButton-terms"
        data-testid="incentiveTrailHeader-linkButton-terms"
        label="Clique e confira todas as informações"
        onClick={() => redirectIncentiveTrailTerms()}
      />
    </header>
  );
};

export default IncentiveTrailHeader;
