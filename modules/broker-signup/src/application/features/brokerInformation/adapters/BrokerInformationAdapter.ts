import { SearchRegisterBrokerDTO } from '../../../types/dto/SearchRegisterBrokerDTO';
import { StatusSusepDTO } from '../../../types/dto/StatusSusepDTO';
import { BrokerInformationModel } from '../../../types/model';

export const brokerInformationAdapter = (
  broker: SearchRegisterBrokerDTO,
  susepInformation: StatusSusepDTO,
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
    susepCode: susepInformation.retorno.numeroSusep.toString(),
    iss: 0,
    simplesOptant: false,
    susepSituation: susepInformation.retorno.situacao === 'Ativo',
    renewRegistration: susepInformation.retorno.recadastrado,
    hasProductDamageInsurance:
      susepInformation.retorno.produtos.find(p => p.produtoId === 305) !==
      undefined,
  };
};
