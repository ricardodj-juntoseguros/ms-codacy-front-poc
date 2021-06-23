import { ModalityTypeEnum } from '../application/types/model';

export function getModalityType(modalityId: number) {
  switch (modalityId) {
    case 1:
      return ModalityTypeEnum.EXECUTANTE_CONSTRUTOR;
    case 2:
      return ModalityTypeEnum.ANTECIPACAO_DE_RECEBIVEIS_CONTRATUAIS;
    case 3:
      return ModalityTypeEnum.ADUANEIRO_TRANSITO;
    case 4:
      return ModalityTypeEnum.REGISTRO_ANELL;
    case 5:
      return ModalityTypeEnum.PARCELAMENTO_ADMINISTRATIVO_FISCAL;
    case 6:
      return ModalityTypeEnum.RETENCAO_DE_PAGAMENTO;
    default:
      return ModalityTypeEnum.DEFAULT;
  }
}
