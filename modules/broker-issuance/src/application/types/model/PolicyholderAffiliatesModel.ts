import { SearchOptions } from "junto-design-system";

export interface PolicyholderAffiliatesModel extends SearchOptions {
  id: number;
  companyName: string;
  federalId: string;
  city: string;
  state: string;
  label: string;
  value: string;
}
