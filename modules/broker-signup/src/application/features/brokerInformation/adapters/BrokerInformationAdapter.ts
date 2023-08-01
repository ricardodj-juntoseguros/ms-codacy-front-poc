import { SearchRegisterBrokerDTO } from '../../../types/dto/SearchRegisterBrokerDTO';
import { BrokerInformationModel } from '../../../types/model';

export const brokerInformationAdapter = (
  broker: SearchRegisterBrokerDTO,
): BrokerInformationModel => {
  const { status, description, information } = broker;

  return {
    pathUpdate: '',
    status,
    description,
    information,
    bankDetails: {
      name: '',
      bankCode: '',
      accounNumber: '',
      bankNumber: '',
      bankDigit: '',
      accounDigit: '',
    },
    susepCode: '',
    iss: 0,
    simplesOptant: false,
  };
};
