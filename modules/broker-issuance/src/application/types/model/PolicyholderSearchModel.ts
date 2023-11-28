import { SearchOptions } from "junto-design-system";

export interface PolicyholderSearchModel extends SearchOptions {
  id: number;
  companyName: string;
  federalId: string;
}
