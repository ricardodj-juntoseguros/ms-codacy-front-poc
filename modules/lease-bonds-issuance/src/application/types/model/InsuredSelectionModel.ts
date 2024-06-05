import { InsuredModel } from './InsuredModel';
import { InsuredAddressModel } from './InsuredAddressModel';

export interface InsuredSelectionModel {
  insuredSearchValue: string;
  insuredOptions: InsuredModel[];
  loadingSearchInsureds: boolean;
  insuredAddressesOptions: InsuredAddressModel[];
  hasInsuredInactive: boolean;
}
