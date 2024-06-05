import { ModalitySchemaModel, ModalityTypeEnum } from '../../../types/model';
import { CommonProposalSchema } from './Common';

export const PROPOSAL_MODALITY_SCHEMAS: ModalitySchemaModel = {
  [ModalityTypeEnum.BIDDER]: CommonProposalSchema,
  [ModalityTypeEnum.SERVICE_PROVIDER_PERFORMER]: CommonProposalSchema,
};
