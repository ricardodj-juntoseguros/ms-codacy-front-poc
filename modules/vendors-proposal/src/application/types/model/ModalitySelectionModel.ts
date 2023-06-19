import { ModalityDTO } from '../dto';
import { ModalityModel } from './ModalityModel';

export interface ModalitySelectionModel {
  modalityOptions: ModalityDTO[];
  modalityOptionsMapped: ModalityModel[];
  modalityOptionsLoading: boolean;
}
