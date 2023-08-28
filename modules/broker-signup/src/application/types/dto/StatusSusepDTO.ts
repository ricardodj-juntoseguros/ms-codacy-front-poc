export interface StatusSusepDTO {
  retorno: {
    cpfCnpj: string;
    nome: string;
    tipoPessoa: string;
    numeroSusep: number;
    recadastrado: boolean;
    situacao: string;
    dataCadastro: string;
    dataUltimaSituacao: string;
    produtos: {
      produtoId: number;
      nome: string;
    }[];
  };
  mensagem: string;
}
