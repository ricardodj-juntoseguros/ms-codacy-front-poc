import { dashboardTotals } from '../../../constants';
import { DashboardTotalCard } from '../DashboardTotalCard';
import styles from './DashboardTotals.module.scss';

const DashboardTotals: React.FC = () => {
  const renderCards = () => {
    const mockData: { [key: string]: any } = {
      totalPolicyholders: 1267,
      totalOpportunities: 17434,
      totalIS: 'R$ 39.5 bilhões',
      totalPremium: 'R$ 2.7 bilhões',
    };

    return dashboardTotals.map(item => {
      const { icon, key, label, useChangeValue, valueFormatter, fieldName } =
        item;
      return (
        <DashboardTotalCard
          key={key}
          icon={icon}
          totalLabel={label}
          totalValue={
            valueFormatter
              ? valueFormatter(mockData[fieldName])
              : mockData[fieldName].toString()
          }
          changedValue={useChangeValue ? 10 : undefined}
        />
      );
    });
  };

  return (
    <div className={styles['dashboard-totals__wrapper']}>{renderCards()}</div>
  );
};

export default DashboardTotals;
