import {
  RegisterBrokerTypeEnum,
  CompanyInformationModel,
  BankModel,
} from '../model';

export interface BrokerInformationModel {
  pathUpdate: string;
  status: RegisterBrokerTypeEnum;
  description: string;
  information: CompanyInformationModel;
  bankDetails: BankModel;
  susepCode: string;
  iss: number;
  simplesOptant: boolean;
  susepSituation: boolean;
  renewRegistration: boolean;
  hasProductDamageInsurance: boolean;
  codeIsValid: boolean;
}
