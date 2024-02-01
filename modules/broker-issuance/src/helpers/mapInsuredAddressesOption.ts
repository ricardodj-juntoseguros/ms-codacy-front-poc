import { InsuredAddressDTO } from "../application/types/dto";
import { InsuredAddressModel } from "../application/types/model/InsuredAddressModel";

export function mapInsuredAddressesOption(address: InsuredAddressDTO): InsuredAddressModel {
  const city = address.city ? `- ${address.city}` : '';
  const state = address.state ? `, ${address.state}` : '';
  return ({
    ...address,
    value: address.addressId.toString(),
    label: address.street ? `${address.street} ${city}${state}` : '',
  })
}