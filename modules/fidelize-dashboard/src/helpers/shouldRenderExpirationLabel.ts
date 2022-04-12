import { OpportunityDetailsItemDTO } from '../application/types/dto';
import { OpportunityDetailsTypeEnum } from '../application/types/model';

export const shouldRenderExpirationLabel = (
  opportunity: OpportunityDetailsItemDTO,
) => {
  const { category, type } = opportunity;

  if (type === OpportunityDetailsTypeEnum.FISCAL) {
    const fiscalShouldRender = ['Renovação', 'Fiança'];
    return fiscalShouldRender.includes(category);
  }
  return false;
};
