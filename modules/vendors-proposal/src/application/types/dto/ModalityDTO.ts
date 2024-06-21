export interface SubmodalityDTO {
  subModalityId: number;
  externalDescription: string;
  additionalCoverage: boolean;
}

export interface ModalityDTO {
  modalityId: number;
  externalDescription: string;
  allowsAdditionalCoverageLabor: boolean;
  submodalities: SubmodalityDTO[];
}
