import { Divider } from 'junto-design-system';
import styles from './DashboardContainer.module.scss';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardSummary from '../../components/DashboardSummary';

function DashboardContainer() {
  return (
    <div className={styles['dashboard-container__wrapper']}>
      <DashboardHeader />
      <Divider />
      <DashboardSummary />
    </div>
  );
}

export default DashboardContainer;
