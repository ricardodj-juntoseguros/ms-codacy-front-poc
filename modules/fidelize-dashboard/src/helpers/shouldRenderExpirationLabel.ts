import { OpportunityDetailsItemDTO } from '../application/types/dto';
import { OpportunityDetailsTypeEnum } from '../application/types/model';

export const shouldRenderExpirationLabel = (
  opportunity: OpportunityDetailsItemDTO,
) => {
  const { category, type } = opportunity;

  if (
    type === OpportunityDetailsTypeEnum.FISCAL ||
    type === OpportunityDetailsTypeEnum.LABOR
  ) {
    const categoriesShouldRender = ['Renovação', 'Fiança'];
    return categoriesShouldRender.includes(category);
  }
  return false;
};
