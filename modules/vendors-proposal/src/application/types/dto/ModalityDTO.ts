export interface SubmodalityDTO {
  subModalityId: number;
  externalDescription: string;
}

export interface ModalityDTO {
  modalityId: number;
  externalDescription: string;
  allowsAdditionalCoverageLabor: boolean;
  submodalities: SubmodalityDTO[];
}
