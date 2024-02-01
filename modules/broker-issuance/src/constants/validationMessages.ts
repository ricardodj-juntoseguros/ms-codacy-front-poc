export const VALIDATION_MESSAGES = {
  required: 'O preenchimento deste campo é obrigatório',
  min: 'Valor menor que o mínimo permitido',
  invalidDate: 'Data inválida',
  initialValidityMaxRetroactive:
    'A data de início da vigência ultrapassa o limite retroativo',
  invalidValidityRange: 'Data final menor ou igual a data inicial',
  endValidityLessThanToday: 'Data final deve ser após o dia de hoje',
  maxSecuredAmount: 'O valor de cobertura não pode ser maior que o limite',
  invalidPolicyholderFederalId: 'CNPJ do tomador informado é inválido',
  invalidPolicyholderAffiliateFederalId:
    'CNPJ da filial do tomador informado é inválido',
  invalidBrokerFederalId: 'CNPJ do corretor inválido',
  invalidProposalFeeValue:
    'O valor da taxa padrão deve estar entre 0% e 11,99%',
  invalidCommissionFlexValue:
    'Você pode adicionar até %VALUE% de comissão flex',
  invalidFeeFlexValue: 'O valor da taxa flex não pode ser maior que %VALUE% %',
  invalidEmail: 'Por favor digite um E-mail válido.',
  invalidFirstDueDate: 'Data informada não está no intervalo permitido!',
};
