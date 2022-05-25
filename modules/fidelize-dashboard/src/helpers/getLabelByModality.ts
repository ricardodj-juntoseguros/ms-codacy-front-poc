import { ModalityEnum } from '../application/types/model';

export const getLabelByModality = (
  modality: ModalityEnum,
  preffix = '',
  isPlural = false,
  capitalizeFirst = false,
) => {
  let label: string;
  switch (modality) {
    case ModalityEnum.FISCAL:
      label = isPlural ? 'fiscais' : 'fiscal';
      break;
    case ModalityEnum.CIVIL:
      label = isPlural ? 'cíveis' : 'cível';
      break;
    case ModalityEnum.TRABALHISTA:
      label = isPlural ? 'trabalhistas' : 'trabalhista';
      break;
    default:
      return '';
  }
  if (capitalizeFirst) {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  }
  return `${preffix} ${label}`;
};
