import { Divider } from 'junto-design-system';
import styles from './DashboardContainer.module.scss';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardTotals from '../../components/DashboardTotals';

function DashboardContainer() {
  return (
    <div className={styles['dashboard-container__wrapper']}>
      <DashboardHeader />
      <Divider />
      <DashboardTotals />
    </div>
  );
}

export default DashboardContainer;
