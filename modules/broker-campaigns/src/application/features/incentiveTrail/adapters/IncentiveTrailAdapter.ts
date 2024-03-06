import { currencyFormatter } from '@shared/utils';
import { format } from 'date-fns';
import { IncentiveTrailDTO } from '../../../types/dto';
import { IncentiveTrail } from '../../../types/model';

export const incentiveTrailAdapter = (
  campaignData: IncentiveTrailDTO,
): IncentiveTrail => {
  const steps = campaignData.conquests.map(step => ({
    stepBonusValue: currencyFormatter(step.bonus),
    productionGoal: currencyFormatter(step.accumulatedValue),
    stepPercentage: Number(step.percentageCompleted.toFixed()),
    status: step.status,
    valueLeft: currencyFormatter(step.amountLeft),
    expirationDate: step.expirationDate
      ? format(new Date(step.expirationDate), 'dd/MM/yyyy')
      : null,
  }));
  return {
    accumulatedValue: currencyFormatter(campaignData.valueAccumulation),
    steps,
    lastUpdate: format(
      new Date(campaignData.dateProduction),
      "dd/MM/yyyy 'às' HH'h'mm",
    ),
  };
};
