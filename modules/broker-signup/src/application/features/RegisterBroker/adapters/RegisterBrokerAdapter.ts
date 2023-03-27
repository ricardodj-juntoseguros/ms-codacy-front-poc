import { BrokerInformationModel } from '../../../types/model';

export const registerBrokerAdapter = (broker: BrokerInformationModel)  => {
  const { information,bankDetails } = broker;
  const { federalId, brokerCompanyName,address,complement,city } = information;
  const { name, bankNumber,accounNumber,bankDigit,accounDigit } = bankDetails;
  return {
    federalId,
    brokerCompanyName,
    address,
    complement,
    zipCode: information.cep,
    city,
    bankName: name,
    bankNumber: parseInt(bankNumber, 10) || 0,
    digitalAgencyNumber: parseInt(bankDigit, 10) || 0,
    digitalContactNumber: parseInt(accounDigit, 10) || 0,
    currentAccountNumber: parseInt(accounNumber, 10) || 0,
    branchNumber: parseInt(broker.susepCode, 10) || 0,
    simplesOptant: broker.simplesOptant,
    iSS: broker.iss,
    susepCode: parseInt(broker.susepCode, 10) || 0,
  };
};
