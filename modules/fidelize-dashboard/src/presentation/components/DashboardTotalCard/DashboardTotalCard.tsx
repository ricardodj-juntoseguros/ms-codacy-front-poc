import classNames from 'classnames';
import styles from './DashboardTotalCard.module.scss';

export interface DashboardTotalCardProps {
  icon: string;
  totalValue: string;
  totalLabel: string;
  changedValue?: number | null | undefined;
}

export const DashboardTotalCard: React.FC<DashboardTotalCardProps> = ({
  icon,
  totalValue,
  totalLabel,
  changedValue,
}) => {
  return (
    <div className={styles['dashboard-total-card__wrapper']}>
      <div className={styles['dashboard-total-card__icon-wrapper']}>
        <i
          className={classNames(
            `icon icon-${icon}`,
            styles['dashboard-total-card__icon'],
          )}
        />
      </div>
      <p className={styles['dashboard-total-card__value']}>{totalValue}</p>
      <p className={styles['dashboard-total-card__label']}>{totalLabel}</p>
      {changedValue && (
        <p className={styles['dashboard-total-card__changed-value']}>
          <span>{`+ ${changedValue} `}</span>
          desde o último acesso
        </p>
      )}
    </div>
  );
};
