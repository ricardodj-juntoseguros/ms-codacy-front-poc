import { Skeleton } from 'junto-design-system';
import classNames from 'classnames';
import styles from './DashboardTotalCard.module.scss';

export interface DashboardTotalCardProps {
  isMoney: boolean;
  icon: string;
  totalValue?: string | null;
  totalLabel: string;
  changedValue?: number | null | undefined;
  error: boolean;
  loading: boolean;
}

export const DashboardTotalCard: React.FC<DashboardTotalCardProps> = ({
  isMoney,
  icon,
  totalValue,
  totalLabel,
  changedValue,
  error,
  loading,
}) => {
  const renderSkeleton = () => {
    return (
      <>
        <Skeleton height={40} width={40} />
        <Skeleton height={16} width={82} style={{ marginTop: 16 }} />
        <Skeleton height={8} width={160} style={{ marginTop: 16 }} />
      </>
    );
  };

  const renderError = () => {
    return (
      <p className={styles['dashboard-total-card__error']}>
        Ocorreu um erro inesperado ao carregar esta informação.
      </p>
    );
  };

  return (
    <div className={styles['dashboard-total-card__wrapper']}>
      {loading && !error && renderSkeleton()}
      {error && !loading && renderError()}
      {!error && !loading && (
        <>
          <div className={styles['dashboard-total-card__icon-wrapper']}>
            <i
              className={classNames(
                `icon icon-${icon}`,
                styles['dashboard-total-card__icon'],
              )}
            />
          </div>
          <p className={styles['dashboard-total-card__value']}>
            {isMoney ? `R$ ${totalValue}` : totalValue}
          </p>
          <p className={styles['dashboard-total-card__label']}>{totalLabel}</p>
          {changedValue && (
            <p className={styles['dashboard-total-card__changed-value']}>
              <span>{`+ ${changedValue} `}</span>
              desde o último acesso
            </p>
          )}
        </>
      )}
    </div>
  );
};
