import { ModalityTypeEnum } from '../application/types/model';

export function getModalityType(modalityId: number) {
  switch (modalityId) {
    case 1:
      return ModalityTypeEnum.EXECUTANTE_CONSTRUTOR;
    case 2:
      return ModalityTypeEnum.ANTECIPACAO_DE_RECEBIVEIS_CONTRATUAIS;
    default:
      return ModalityTypeEnum.DEFAULT;
  }
}
