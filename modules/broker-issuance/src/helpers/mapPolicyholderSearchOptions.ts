import { federalIdFormatter } from '@shared/utils';
import { PolicyholderSearchDTO } from '../application/types/dto';
import { PolicyholderSearchModel } from '../application/types/model';

export function mapPolicyholderSearchOptions(
  policyholderSearch: PolicyholderSearchDTO,
): PolicyholderSearchModel[] {
  return policyholderSearch.records.map(policyholder => ({
    id: policyholder.id,
    federalId: policyholder.federalId,
    companyName: policyholder.name,
    label: `${federalIdFormatter(policyholder.federalId)} - ${
      policyholder.name
    }`,
    value: policyholder.federalId,
  }));
}
