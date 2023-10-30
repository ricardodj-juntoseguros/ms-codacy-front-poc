import { ModalityTypeEnum } from '../application/types/model';
import { groupModalities } from '../constants';

export function getModalityByGroup(modality: ModalityTypeEnum) {
  return groupModalities[modality];
}
