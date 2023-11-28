import { ModalityTypeEnum } from '../application/types/model';
import { groupModalities } from '../constants/modalities2';

export function getModalityByGroup(modality: ModalityTypeEnum) {
  return groupModalities[modality];
}
