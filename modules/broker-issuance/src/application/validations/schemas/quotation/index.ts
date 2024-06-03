import { ModalitySchemaModel, ModalityTypeEnum } from '../../../types/model';
import { CommonQuotationSchema } from './Common';

export const QUOTATITON_MODALITY_SCHEMAS: ModalitySchemaModel = {
  [ModalityTypeEnum.BIDDER]: CommonQuotationSchema,
  [ModalityTypeEnum.SERVICE_PROVIDER_PERFORMER]: CommonQuotationSchema,
  [ModalityTypeEnum.BUILDER_PERFORMER]: CommonQuotationSchema,
  [ModalityTypeEnum.SUPPLIER_PERFORMER]: CommonQuotationSchema,
};
