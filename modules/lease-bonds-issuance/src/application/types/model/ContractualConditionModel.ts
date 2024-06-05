import { CustomClauseDTO } from "../dto";

export interface ContractualConditionModel {
  currentContractualCondition: CustomClauseDTO | null;
  requestedBy: number | null;
  text: string;
  openContractualConditions: boolean;
  loadingContractualCondition: boolean;
  hasContractualConditionsChanges: boolean;
}
