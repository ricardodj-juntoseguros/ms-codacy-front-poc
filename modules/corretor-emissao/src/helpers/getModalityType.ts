import { ModalityTypeEnum } from '../application/types/model';

export function getModalityType(modalityId: number) {
  switch (modalityId) {
    case 1:
      return ModalityTypeEnum.EXECUTANTE_CONSTRUTOR;
    case 2:
      return ModalityTypeEnum.EXECUTANTE_CONSTRUTOR_TERMINO_DE_OBRAS;
    case 3:
      return ModalityTypeEnum.ANTECIPACAO_DE_RECEBIVEIS_CONTRATUAIS;
    case 4:
      return ModalityTypeEnum.ADUANEIRO_TRANSITO;
    case 5:
      return ModalityTypeEnum.REGISTRO_ANELL;
    case 6:
      return ModalityTypeEnum.PARCELAMENTO_ADMINISTRATIVO_FISCAL;
    case 7:
      return ModalityTypeEnum.RETENCAO_DE_PAGAMENTO;
    case 8:
      return ModalityTypeEnum.CONTA_RESERVA;
    case 9:
      return ModalityTypeEnum.ADMINISTRATIVO_CREDITO_TRIBUTARIO;
    case 10:
      return ModalityTypeEnum.EXECUTANTE_CONCESSIONARIO;
    case 11:
      return ModalityTypeEnum.ADIANTAMENTO_DE_PAGAMENTO;
    case 12:
      return ModalityTypeEnum.PROCESSO_ADMINISTRATIVO;
    default:
      return ModalityTypeEnum.DEFAULT;
  }
}
