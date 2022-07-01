import { useSelector } from 'react-redux';
import { SUMMARY_CARDS } from '../../../constants';
import { DashboardTotalCard } from '../DashboardTotalCard';
import styles from './DashboardSummary.module.scss';
import { selectPolicyholdersSummary } from '../../../application/features/summary/SummarySlice';

interface DashboardSummaryProps {
  totalOpportunities: number | undefined;
  errorModalitySummary: boolean
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({totalOpportunities, errorModalitySummary}) => {
  const { totalPolicyholders, errorPolicyholders } = useSelector(
    selectPolicyholdersSummary,
  );
  const renderCards = () => {
    const mapConstantsToState = [
      {
        key: 'policyholders',
        value: totalPolicyholders,
        error: errorPolicyholders,
      },
      {
        key: 'opportunities',
        value: totalOpportunities,
        error: errorModalitySummary,
      },    
    ];

    return SUMMARY_CARDS.map(item => {
      const { icon, key, label, useChangeValue, valueFormatter } = item;
      const dataToRender = mapConstantsToState.find(each => each.key === key);

      if (!dataToRender) return null;
      const { value, error } = dataToRender;

      return (
        <DashboardTotalCard
          key={key}
          icon={icon}
          totalLabel={label}
          totalValue={
            valueFormatter ? valueFormatter(value || 0) : value?.toString()
          }
          changedValue={useChangeValue ? 10 : undefined}
          error={error}
          loading={value === undefined}
        />
      );
    });
  };

  return (
    <div className={styles['dashboard-summary__wrapper']}>{renderCards()}</div>
  );
};

export default DashboardSummary;
