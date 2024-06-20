import { RenewalFileTypeEnum } from '../model';

export interface RenewalDocumentDTO {
  id: RenewalFileTypeEnum;
  description: string;
  hasChoiceOfNumberingType: boolean;
}

export interface RenewalDocumentListDTO {
  success: boolean;
  data: RenewalDocumentDTO[];
  errors: string | string[] | null;
}
