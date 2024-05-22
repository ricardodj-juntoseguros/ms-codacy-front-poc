import { StepComponentModel } from '@shared/hooks';
import { ModalityTypeEnum } from '../../application/types/model';
import { BIDDER_STEPS } from './bidderSteps';
import { SERVICE_PROVIDER_PERFORMER_STEPS } from './serviceProviderPerformerSteps';

interface ModalitySteps {
  [x: number]: StepComponentModel[];
}

const ACTIVE_MODALITIES: ModalitySteps = {
  [ModalityTypeEnum.BIDDER]: BIDDER_STEPS,
};

const DEVELOPMENT_MODALITIES = {
  [ModalityTypeEnum.SERVICE_PROVIDER_PERFORMER]:
    SERVICE_PROVIDER_PERFORMER_STEPS,
};

export const MODALITY_STEPS: ModalitySteps =
  process.env.NX_GLOBAL_ENVIROMENT === 'qa'
    ? Object.assign(ACTIVE_MODALITIES, DEVELOPMENT_MODALITIES)
    : ACTIVE_MODALITIES;
