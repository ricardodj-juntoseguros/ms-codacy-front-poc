import { useSelector } from 'react-redux';
import styles from './DashboardHeader.module.scss';
import { checkAccessToFeature } from '../../../application/features/accessCheck/AccessCheckSlice';
import { AccessFeatureEnum } from '../../../application/types/model/AccessFeatureEnum';

const DashboardHeader = () => {
  const canRequestOpportunity = useSelector(
    checkAccessToFeature(AccessFeatureEnum.FIDELIZE_SOLICITACAO),
  );
  return (
    <div>
      {canRequestOpportunity ? (
        <>
          <h2 className={styles['dashboard-solicitacao-header__subtitle']}>
            Fidelize Dashboard
          </h2>
          <h1
            data-testid="dashboard-opportunity-text"
            className={styles['dashboard-solicitacao-header__title']}
          >
            Veja as oportunidades judiciais dos seus clientes
          </h1>
        </>
      ) : (
        <>
          <h1 className={styles['dashboard-header__title']}>
            Fidelize Dashboard
          </h1>
          <h2
            data-testid="dashboard-opportunity-text"
            className={styles['dashboard-header__subtitle']}
          >
            Visualize as oportunidades judiciais que o Fidelize já mapeou para
            alguns tomadores da sua carteira. Caso queira solicitar mapeamento
            de outro tomador, fale com o seu comercial responsável.
          </h2>
        </>
      )}
    </div>
  );
};

export default DashboardHeader;
