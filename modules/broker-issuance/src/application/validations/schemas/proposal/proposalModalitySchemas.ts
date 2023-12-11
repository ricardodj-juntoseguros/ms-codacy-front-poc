import { AnyObjectSchema } from "yup";
import { CommonProposalSchema } from "./Common";

interface ProposalModalitySchema {
  [x: number]: AnyObjectSchema
}

export const PROPOSAL_MODALITY_SCHEMAS: ProposalModalitySchema = {
  99: CommonProposalSchema, // Licitante
}
