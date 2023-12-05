import { StepComponentModel } from "@shared/hooks";
import { COMMON_STEPS } from "./commonSteps";

interface ModalitySteps {
  [x: number]: StepComponentModel[]
}

export const MODALITY_STEPS: ModalitySteps = {
  99: COMMON_STEPS, // Licitante
}
