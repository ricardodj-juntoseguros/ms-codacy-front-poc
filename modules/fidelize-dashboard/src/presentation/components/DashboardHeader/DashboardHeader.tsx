import styles from './DashboardHeader.module.scss';

const DashboardHeader = () => {
  return (
    <div>
      <h1 className={styles['dashboard-header__title']}>Fidelize Dashboard</h1>
      <h2 className={styles['dashboard-header__subtitle']}>
        Visualize as oportunidades Judiciais que o Projeto Fidelize já mapeou
        para alguns Tomadores da sua carteira. Além disso, você poderá solicitar
        novos mapeamentos para Tomadores vinculados a sua Corretora.
      </h2>
    </div>
  );
};

export default DashboardHeader;
