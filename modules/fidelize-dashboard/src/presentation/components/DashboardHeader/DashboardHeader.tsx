import styles from './DashboardHeader.module.scss';

const DashboardHeader = () => {
  return (
    <div>
      <h1 className={styles['dashboard-header__title']}>Fidelize Dashboard</h1>
      <h2 className={styles['dashboard-header__subtitle']}>
        Visualize as oportunidades judiciais que o Projeto Fidelize já mapeou
        para alguns tomadores da sua carteira. Caso queira solicitar mapeamento
        de outro tomador, fale com o seu comercial responsável.
      </h2>
    </div>
  );
};

export default DashboardHeader;
