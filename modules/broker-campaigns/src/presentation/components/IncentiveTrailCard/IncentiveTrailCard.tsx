import { FunctionComponent, useMemo } from 'react';
import { Button, Tag } from 'junto-design-system';
import classNames from 'classnames';
import { INCENTIVE_TRAIL_STATUS_CONFIG } from '../../../constants';
import {
  IncentiveTrailStep,
  IncentiveTrailStepStatusEnum,
} from '../../../application/types/model';
import styles from './IncentiveTrailCard.module.scss';

interface IncentiveTrailCardProps extends IncentiveTrailStep {
  onToggleModalRedeem: () => void;
}

const IncentiveTrailCard: FunctionComponent<IncentiveTrailCardProps> = ({
  stepBonusValue,
  productionGoal,
  stepPercentage,
  status,
  valueLeft,
  expirationDate,
  onToggleModalRedeem,
}) => {
  const stepPercentageVariant: any = useMemo(() => {
    if (stepPercentage >= 0 && stepPercentage <= 33) return 'error';
    if (stepPercentage > 33 && stepPercentage <= 66) return 'warning';
    return 'success';
  }, [stepPercentage]);

  const renderStatus = () => {
    let { label } = INCENTIVE_TRAIL_STATUS_CONFIG[status];
    if (
      (status === IncentiveTrailStepStatusEnum.expired ||
        status === IncentiveTrailStepStatusEnum.available) &&
      !expirationDate
    ) {
      return null;
    }

    switch (status) {
      case IncentiveTrailStepStatusEnum.expired:
        label = expirationDate ? `${label} ${expirationDate}` : '';
        break;
      case IncentiveTrailStepStatusEnum.toExpire:
        label = expirationDate ? `${label} ${expirationDate}` : '';
        break;
      case IncentiveTrailStepStatusEnum.available:
        label = expirationDate ? `${label} ${expirationDate}` : '';
        break;
      case IncentiveTrailStepStatusEnum.requested:
        label = expirationDate ? `${label} ${expirationDate}` : '';
        break;
      case IncentiveTrailStepStatusEnum.unavailable:
        label = `${label} ${valueLeft}`;
        break;
      case IncentiveTrailStepStatusEnum.paid:
        label = `${label}`;
        break;
      default:
        break;
    }

    return (
      <p className={styles['incentive-trail-card__status']}>
        <i
          className={classNames(
            'icon',
            INCENTIVE_TRAIL_STATUS_CONFIG[status].icon,
            styles[
              `incentive-trail-card__status-icon--${status.toLowerCase()}`
            ],
            styles['incentive-trail-card__status-icon'],
          )}
        />
        {label}
      </p>
    );
  };

  const renderRedeemButton = () => {
    if (
      status === IncentiveTrailStepStatusEnum.expired ||
      status === IncentiveTrailStepStatusEnum.unavailable ||
      status === IncentiveTrailStepStatusEnum.paid
    ) {
      return null;
    }
    return (
      <Button
        id="incentiveTrailCard-button-redeem"
        data-testid="incentiveTrailCard-button-redeem"
        type="button"
        size="small"
        onClick={() => onToggleModalRedeem()}
      >
        Resgatar
      </Button>
    );
  };

  return (
    <li className={styles['incentive-trail-card__wrapper']}>
      <p className={styles['incentive-trail-card__bonus']}>
        <span className={styles['incentive-trail-card__description']}>
          Bônus
        </span>
        {stepBonusValue}
        <Tag
          data-testid="incentiveTrailCard-tag-percentage"
          variant={stepPercentageVariant}
        >
          {stepPercentage}%
        </Tag>
      </p>
      <p className={styles['incentive-trail-card__production']}>
        <span className={styles['incentive-trail-card__description']}>
          Produção
        </span>
        {productionGoal}
      </p>
      {renderStatus()}
      {renderRedeemButton()}
    </li>
  );
};

export default IncentiveTrailCard;
