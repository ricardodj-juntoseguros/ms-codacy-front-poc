import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { summaryCards } from '../../../constants';
import { DashboardTotalCard } from '../DashboardTotalCard';
import styles from './DashboardSummary.module.scss';
import SummaryApi from '../../../application/features/summary/SummaryApi';
import { selectPolicyholderSelection } from '../../../application/features/policyholderFilter/PolicyholderFilterSlice';

interface DashboardSummaryData {
  value: number | null;
  loading: boolean;
  error: boolean;
}

const DashboardSummary: React.FC = () => {
  const filteredFederalIds = useSelector(selectPolicyholderSelection);
  const [policyholders, setPolicyholders] = useState<DashboardSummaryData>({
    value: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    setPolicyholders({
      value: null,
      loading: true,
      error: false,
    });
    fetchSummaryData(filteredFederalIds);
  }, [filteredFederalIds]);

  const fetchSummaryData = (federalIds: string[]) => {
    SummaryApi.getPolicyholdersTotal(federalIds)
      .then(response => {
        setPolicyholders({
          value: response.totalPolicyholders,
          loading: false,
          error: false,
        });
      })
      .catch(() => {
        setPolicyholders({ value: null, loading: false, error: true });
      });
  };

  const renderCards = () => {
    const mapConstantsToState = [
      { key: 'policyholders', stateToUse: policyholders },
    ];

    return summaryCards.map(item => {
      const { icon, key, label, useChangeValue, valueFormatter } = item;
      const dataToRender = mapConstantsToState.find(each => each.key === key);

      if (!dataToRender) return null;

      const {
        stateToUse: { error, loading, value },
      } = dataToRender;

      return (
        <DashboardTotalCard
          key={key}
          icon={icon}
          totalLabel={label}
          totalValue={
            valueFormatter ? valueFormatter(value) : value?.toString()
          }
          changedValue={useChangeValue ? 10 : undefined}
          error={error}
          loading={loading}
        />
      );
    });
  };

  return (
    <div className={styles['dashboard-summary__wrapper']}>{renderCards()}</div>
  );
};

export default DashboardSummary;
