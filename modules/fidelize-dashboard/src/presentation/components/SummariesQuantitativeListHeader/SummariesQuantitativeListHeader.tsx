import styles from './SummariesQuantitativeListHeader.module.scss';

const SummariesQuantitativeListHeader: React.FC = () => {
  return (
    <div className={styles['summaries-quantitative-list-header__container']}>
      <h2>Estimativa de processos ativos</h2>
      <div className={styles['summaries-quantitative-list-header__wrapper']}>
        <div>
          <span>TOMADOR</span>
        </div>
        <div>
          <span>PROCESSOS ESTIMADOS</span>
        </div>
        <div>
          <span>RESULTADO DA ANÁLISE</span>
        </div>
      </div>
    </div>
  );
};

export default SummariesQuantitativeListHeader;
