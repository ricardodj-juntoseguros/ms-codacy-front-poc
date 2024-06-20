import { StepComponentModel } from '@shared/hooks';
import { BrokerPlatformAuthService } from '@services';
import { ModalityTypeEnum } from '../../application/types/model';
import { BIDDER_STEPS } from './bidderSteps';
import { SERVICE_PROVIDER_PERFORMER_STEPS } from './serviceProviderPerformerSteps';
import { COMMON_COVERAGE_LABOR_STEPS } from './commonCoverageLaborSteps';
import { DEFAULT_STEP } from './defaultStep';
import { DEFAULT_STEP_WITH_RENEWAL } from './defaultStepWithRenewal';

interface ModalitySteps {
  [x: number]: StepComponentModel[];
}

export const getDefaultStep = (modalityId: number): StepComponentModel[] => {
  const DEFAULT_STEP_MODALITIES: ModalitySteps = {
    [ModalityTypeEnum.BIDDER]: DEFAULT_STEP,
    [ModalityTypeEnum.SERVICE_PROVIDER_PERFORMER]: DEFAULT_STEP_WITH_RENEWAL,
    [ModalityTypeEnum.BUILDER_PERFORMER]: DEFAULT_STEP,
    [ModalityTypeEnum.SUPPLIER_PERFORMER]: DEFAULT_STEP,
  };

  return DEFAULT_STEP_MODALITIES[modalityId];
};

const ACTIVE_MODALITIES: ModalitySteps = {
  [ModalityTypeEnum.BIDDER]: BIDDER_STEPS,
  [ModalityTypeEnum.SERVICE_PROVIDER_PERFORMER]:
    SERVICE_PROVIDER_PERFORMER_STEPS,
  [ModalityTypeEnum.BUILDER_PERFORMER]: COMMON_COVERAGE_LABOR_STEPS,
  [ModalityTypeEnum.SUPPLIER_PERFORMER]: COMMON_COVERAGE_LABOR_STEPS,
};

const DEVELOPMENT_MODALITIES = {};

const username = BrokerPlatformAuthService.getUsername();
export const MODALITY_STEPS: ModalitySteps =
  process.env.NX_GLOBAL_ENVIROMENT === 'qa' ||
  (username && username === 'testecorretor_cor')
    ? Object.assign(ACTIVE_MODALITIES, DEVELOPMENT_MODALITIES)
    : ACTIVE_MODALITIES;
