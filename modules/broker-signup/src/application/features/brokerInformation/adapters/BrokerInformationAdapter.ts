import { SearchRegisterBrokerDTO } from '../../../types/dto/SearchRegisterBrokerDTO';
import { BrokerInformationModel } from '../../../types/model';

export const brokerInformationAdapter = (broker: SearchRegisterBrokerDTO): BrokerInformationModel => {
  const {
    status,
    description,
    information,
  } = broker;

  return {
    status,
    description,
    information: {
        federalId: information.cnpj,
        parentCompany: information.matriz_filial,
        corporateName: information.razao_social,
        fantasyName: information.nome_fantasia,
        situation: information.situacao,
        dateSituation: information.data_situacao,
        reasonSituation: information.motivo_situacao,
        cityNameForeign: information.nm_cidade_exterior,
        countryCod: information.cod_pais,
        countryName: information.nome_pais,
        codNatJuridica: information.cod_nat_juridica,
        dateStart: information.data_inicio_ativ,
        cnaeFiscal: information.cnae_fiscal,
        addressType: information.tipo_logradouro,
        address: information.logradouro,
        number: information.numero,
        complement: information.complemento,
        neighbourhood: information.bairro,
        cep: information.cep,
        uf: information.uf,
        municipalityCod: information.cod_municipio,
        municipality: information.municipio,
        ddd1: information.ddd_1,
        phone1: information.telefone_1,
        ddd2: information.ddd_2,
        phone2: information.telefone_2,
        dddfax: information.ddd_fax,
        numberFax: information.num_fax,
        email: information.email,
        qualifResp: information.qualif_resp,
        shareCapital: information.capital_social,
        size: information.porte,
        opcSimple: information.opc_simples,
        dateOpcSimple: information.data_opc_simples,
        dateExcSimple: information.data_exc_simples,
        opcMei: information.opc_mei,
        specialSituation: information.sit_especial,
        dateSpecialSituation: information.data_situacao,
    }
  };
};
