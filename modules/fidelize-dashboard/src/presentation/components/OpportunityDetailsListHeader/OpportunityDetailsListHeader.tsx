import styles from './OpportunityDetailsListHeader.module.scss';

const OpportunityDetailsListHeader: React.FC = () => {
  return (
    <div className={styles['opportunity-details-header__wrapper']}>
      <div>
        <p className={styles['opportunity-details-header__column-title']}>
          TIPO/OBS.
        </p>
      </div>
      <div>
        <p className={styles['opportunity-details-header__column-title']}>
          VALOR IS
        </p>
      </div>
      <div>
        <p className={styles['opportunity-details-header__column-title']}>
          TOMADOR
        </p>
      </div>
      <div>
        <p className={styles['opportunity-details-header__column-title']}>
          DT MAPEAMENTO
        </p>
      </div>
    </div>
  );
};

export default OpportunityDetailsListHeader;
