import { OpportunityDetailsItemDTO } from '../application/types/dto';
import {
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
} from '../application/types/model';
import { shouldRenderExpirationLabel } from './shouldRenderExpirationLabel';

describe('ShouldRenderExpirationLabel Helper', () => {
  it('Should return true if type is Fiscal and category is Fiança', () => {
    const mockOpportunity: OpportunityDetailsItemDTO = {
      id: 'id',
      expiration: 'expiration',
      mappingDate: 'mappingDate',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      securityAmount: 10000,
      type: OpportunityDetailsTypeEnum.FISCAL,
      category: 'Fiança',
      expired: false,
    };
    const result = shouldRenderExpirationLabel(mockOpportunity);
    expect(result).toBeTruthy();
  });

  it('Should return true if type is Fiscal and category is Renovação', () => {
    const mockOpportunity: OpportunityDetailsItemDTO = {
      id: 'id',
      expiration: 'expiration',
      mappingDate: 'mappingDate',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      securityAmount: 10000,
      type: OpportunityDetailsTypeEnum.FISCAL,
      category: 'Renovação',
      expired: false,
    };
    const result = shouldRenderExpirationLabel(mockOpportunity);
    expect(result).toBeTruthy();
  });
});
