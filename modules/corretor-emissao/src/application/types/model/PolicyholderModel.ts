export interface PolicyholderModel {
  activity: string;
  city: string;
  class: string;
  closingReferenceDay: number;
  companyName: string;
  district: string;
  email?: string;
  externalId: number;
  federalId: string;
  hangs: Array<any>;
  id: number;
  invoiceDueDateDay: number;
  isNew: boolean;
  phoneNumber?: number;
  producerRegionals?: string;
  regionalName?: string;
  state: string;
  street: string;
  useBill: boolean;
  validCredit: boolean;
  zipCode: string;
}
