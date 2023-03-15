/* eslint-disable camelcase */
import {
  RegisterBrokerTypeEnum,
  CompanyInformationModel
} from '../model';

export interface BrokerInformationModel {
  status: RegisterBrokerTypeEnum;
  description: string,
  information: CompanyInformationModel;
}
