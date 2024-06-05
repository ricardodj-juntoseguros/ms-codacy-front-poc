import { SearchOptions } from "junto-design-system";

export interface AddressModel extends SearchOptions {
  addressExternalId: number;
  addressId: number;
  externalId: number;
  city: string;
  state: string;
  street: string;
}
