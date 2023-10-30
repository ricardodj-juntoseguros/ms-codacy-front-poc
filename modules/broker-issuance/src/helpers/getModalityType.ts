import { ModalityTypeEnum } from '../application/types/model';

export function getModalityType(modalityId: number) {
  switch (modalityId) {
    case 2:
      return ModalityTypeEnum.EXECUTANTE_CONSTRUTOR;
    case 46:
      return ModalityTypeEnum.EXECUTANTE_CONSTRUTOR_TERMINO_DE_OBRAS;
    case 51:
      return ModalityTypeEnum.ANTECIPACAO_DE_RECEBIVEIS_CONTRATUAIS;
    case 59:
      return ModalityTypeEnum.ADUANEIRO_TRANSITO;
    case 48:
      return ModalityTypeEnum.REGISTRO_ANELL;
    case 45:
      return ModalityTypeEnum.PARCELAMENTO_ADMINISTRATIVO_FISCAL;
    case 41:
      return ModalityTypeEnum.RETENCAO_DE_PAGAMENTO;
    case 56:
      return ModalityTypeEnum.CONTA_RESERVA;
    case 49:
      return ModalityTypeEnum.ADMINISTRATIVO_CREDITO_TRIBUTARIO;
    case 39:
      return ModalityTypeEnum.EXECUTANTE_CONCESSIONARIO;
    case 40:
      return ModalityTypeEnum.ADIANTAMENTO_DE_PAGAMENTO;
    case 61:
      return ModalityTypeEnum.PROCESSO_ADMINISTRATIVO;
    default:
      return ModalityTypeEnum.DEFAULT;
  }
}
