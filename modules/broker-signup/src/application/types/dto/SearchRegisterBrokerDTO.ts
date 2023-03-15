/* eslint-disable camelcase */

import {
  RegisterBrokerTypeEnum
} from '../model';

export interface SearchRegisterBrokerDTO {
  status: RegisterBrokerTypeEnum;
  description: string,
  information: {
        cnpj: string,
        matriz_filial: string,
        razao_social: string,
        nome_fantasia: string,
        situacao: string,
        data_situacao: string,
        motivo_situacao: string,
        nm_cidade_exterior: string,
        cod_pais: string,
        nome_pais: string,
        cod_nat_juridica: string,
        data_inicio_ativ: string,
        cnae_fiscal: string,
        tipo_logradouro: string,
        logradouro: string,
        numero: string,
        complemento: string,
        bairro: string,
        cep: string,
        uf: string,
        cod_municipio: string,
        municipio: string,
        ddd_1: string,
        telefone_1: string,
        ddd_2: string,
        telefone_2: string,
        ddd_fax: string,
        num_fax: string,
        email: string,
        qualif_resp: string,
        capital_social:string,
        porte: string,
        opc_simples: string,
        data_opc_simples: string,
        data_exc_simples: string,
        opc_mei: string,
        sit_especial: string,
        data_sit_especial: string
    }
}
