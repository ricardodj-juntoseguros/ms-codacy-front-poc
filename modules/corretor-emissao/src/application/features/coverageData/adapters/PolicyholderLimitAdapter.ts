import { LimitDTO } from '../../../types/dto/LimitDTO';

export const policyholderLimitAdapter = (policyholderLimit: LimitDTO) => {
  const { Limit } = policyholderLimit;
  return {
    limiteDisponivel: Limit.LimiteDisponivel,
    mensagemLimiteFlexibilizacao: Limit.MensagemLimiteFlexibilizacao,
    mensagemLabelLimite: Limit.MensagemLabelLimite,
    exibirLimiteFlexibilizacao: Limit.ExibirLimiteFlexibilizacao,
    valorLimiteFlexibilizacao: Limit.ValorLimiteFlexibilizacao,
  };
};
