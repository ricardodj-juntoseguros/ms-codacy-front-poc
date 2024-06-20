import { ModalitySchemaModel, ModalityTypeEnum } from '../../../types/model';
import { CommonProposalSchema } from './Common';
import { ServiceProviderProposalSchema } from './ServiceProviderPerformer';

export const PROPOSAL_MODALITY_SCHEMAS: ModalitySchemaModel = {
  [ModalityTypeEnum.BIDDER]: CommonProposalSchema,
  [ModalityTypeEnum.SERVICE_PROVIDER_PERFORMER]: ServiceProviderProposalSchema,
  [ModalityTypeEnum.BUILDER_PERFORMER]: CommonProposalSchema,
  [ModalityTypeEnum.SUPPLIER_PERFORMER]: CommonProposalSchema,
};
