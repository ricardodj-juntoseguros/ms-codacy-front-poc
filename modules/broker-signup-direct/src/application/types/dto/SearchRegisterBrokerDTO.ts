/* eslint-disable camelcase */

import { RegisterBrokerTypeEnum } from '../model';

export interface SearchRegisterBrokerDTO {
  status: RegisterBrokerTypeEnum;
  description: string;
  information: {
    federalId: string;
    brokerCompanyName: string;
    address: string;
    number: string;
    opcSimples: boolean;
    complement: string;
    zipCode: string;
    bairro: string;
    city: string;
    state: string;
    email: string;
  };
}
