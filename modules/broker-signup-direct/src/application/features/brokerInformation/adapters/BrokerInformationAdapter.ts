import { SearchRegisterBrokerDTO } from '../../../types/dto/SearchRegisterBrokerDTO';
import { StatusSusepDTO } from '../../../types/dto/StatusSusepDTO';
import { BrokerInformationModel } from '../../../types/model';

export const brokerInformationAdapter = (
  broker: SearchRegisterBrokerDTO,
  susepInformation: StatusSusepDTO,
  codeIsValid: boolean,
): BrokerInformationModel => {
  const { status, description, information } = broker;
  /* Mock para teste de validação do email em QA */
  if (process.env.NX_GLOBAL_ENVIROMENT === 'qa') {
    information.email = 'cadastro@juntoseguros.com';
  }
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
    codeIsValid,
    brokerExternalId: 0,
    brokerUserName: '',
    signupDirect: false,
  };
};
