import { SummariesQuantitativeByPolicyholderDTO } from '../dto/SummariesQuantitativeByPolicyholderDTO';

export interface SummariesQuantitativeModel {
  SummariesQuantitativeByPolicyholder:
    | SummariesQuantitativeByPolicyholderDTO[]
    | null;
}
