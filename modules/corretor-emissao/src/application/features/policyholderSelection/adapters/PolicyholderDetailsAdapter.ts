import { PolicyholderDTO } from '../../../types/dto';

export const policyholderDetailsAdapter = (
  policyholderDetails: PolicyholderDTO,
) => {
  return {
    activity: policyholderDetails.Activity,
    city: policyholderDetails.City,
    class: policyholderDetails.Class,
    closingReferenceDay: policyholderDetails.ClosingReferenceDay,
    companyName: policyholderDetails.CompanyName,
    district: policyholderDetails.District,
    email: policyholderDetails.Email,
    externalId: policyholderDetails.ExternalId,
    federalId: policyholderDetails.FederalId,
    hangs: policyholderDetails.Hangs,
    id: policyholderDetails.Id,
    invoiceDueDateDay: policyholderDetails.InvoiceDueDateDay,
    isNew: policyholderDetails.IsNew,
    phoneNumber: policyholderDetails.PhoneNumber,
    producerRegionals: policyholderDetails.ProducerRegionals,
    regionalName: policyholderDetails.RegionalName,
    state: policyholderDetails.State,
    street: policyholderDetails.Street,
    useBill: policyholderDetails.UseBill,
    validCredit: policyholderDetails.ValidCredit,
    zipCode: policyholderDetails.ZipCode,
  };
};
