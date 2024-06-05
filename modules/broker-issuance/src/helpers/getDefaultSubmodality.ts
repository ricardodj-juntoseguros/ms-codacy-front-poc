import { ModalityModel } from '../application/types/model';
import {
  COVERAGE_LABOR_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID,
  COVERAGE_LABOR_SUBMODALITY_ID,
  DEFAULT_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID,
  DEFAULT_SUBMODALITY_ID,
} from '../constants';

export function getDefaultSubmodality(
  hasLaborCoverage: boolean,
  currentModality: ModalityModel,
) {
  const submodalityId = hasLaborCoverage
    ? COVERAGE_LABOR_SUBMODALITY_ID
    : DEFAULT_SUBMODALITY_ID;
  const containmentAndRescueSubmodalityId = hasLaborCoverage
    ? COVERAGE_LABOR_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID
    : DEFAULT_CONTAINMENT_AND_RESCUE_SUBMODALITY_ID;
  const submodality = currentModality.submodalities.find(
    submodality =>
      submodality.id === submodalityId ||
      submodality.id === containmentAndRescueSubmodalityId,
  );
  return submodality;
}
