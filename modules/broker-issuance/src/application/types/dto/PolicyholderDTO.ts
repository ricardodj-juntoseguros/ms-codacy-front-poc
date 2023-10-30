export interface PolicyholderDTO {
  Activity: string;
  City: string;
  Class: string;
  ClosingReferenceDay: number;
  CompanyName: string;
  District: string;
  Email?: string;
  ExternalId: number;
  FederalId: string;
  Hangs: Array<any>;
  Id: number;
  InvoiceDueDateDay: number;
  IsNew: boolean;
  PhoneNumber?: number;
  ProducerRegionals?: string;
  RegionalName?: string;
  State: string;
  Street: string;
  UseBill: boolean;
  ValidCredit: boolean;
  ZipCode: string;
}
