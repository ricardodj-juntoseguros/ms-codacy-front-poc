import { BrokerInformationModel } from '../../../types/model';
import { SUSEP_CODE_SITUATION } from '../../../../constants/SusepCodeSituation';

export const registerBrokerAdapter = (
  broker: BrokerInformationModel,
  susepCodeSituation: string,
) => {
  const {
    information,
    bankDetails,
    susepSituation,
    renewRegistration,
    hasProductDamageInsurance,
  } = broker;
  const {
    federalId,
    brokerCompanyName,
    address,
    complement,
    city,
    zipCode,
    state,
    email,
    number,
  } = information;
  const { name, bankNumber, accounNumber, bankDigit, accounDigit } =
    bankDetails;
  return {
    federalId: federalId.replace(/[^a-zA-Z0-9]/g, ''),
    brokerCompanyName,
    address,
    complement,
    zipCode,
    state,
    city,
    number,
    bankName: name,
    bankNumber: parseInt(bankNumber, 10) || 0,
    digitalAgencyNumber: parseInt(bankDigit, 10) || 0,
    digitalContactNumber: parseInt(accounDigit, 10) || 0,
    currentAccountNumber: parseInt(accounNumber, 10) || 0,
    branchNumber: parseInt(broker.susepCode, 10) || 0,
    simplesOptant: broker.simplesOptant,
    iSS: broker.iss,
    susepCode: parseInt(broker.susepCode, 10) || 0,
    susepSituation,
    renewRegistration,
    hasProductDamageInsurance,
    email,
    susepCodeSituation: (SUSEP_CODE_SITUATION as any)[
      susepCodeSituation.toLowerCase()
    ],
  };
};
