import { ModalityModel } from './ModalityModel';

export interface ModalitySelectionModel {
  modalityOptions: ModalityModel[];
  loadingGetModalities: boolean;
}
