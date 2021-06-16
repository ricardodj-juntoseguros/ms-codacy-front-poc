import { StepModel, Modalities } from '../application/types/model';
import { ContractDataContainer } from '../presentation/components/contractDataContainer';
import { RateCalculationContainer } from '../presentation/components/rateCalculationContainer';
import { TimeframeAndCoverageContainer } from '../presentation/components/timeframeAndCoverageContainer';

export const defaultStep: StepModel = {
  name: 'SearchContainer',
  number: 1,
  isActive: true,
  isCompleted: false,
  nextStep: '',
};

export const modalities: Modalities = {
  EXECUTANTE_CONSTRUTOR: {
    steps: [
      {
        name: 'TimeframeAndCoverageContainer',
        number: 2,
        isActive: false,
        isCompleted: false,
        Component: TimeframeAndCoverageContainer,
        nextStep: 'RateCalculationContainer',
      },
      {
        name: 'RateCalculationContainer',
        number: 3,
        isActive: false,
        isCompleted: false,
        Component: RateCalculationContainer,
        nextStep: 'ContractDataContainer',
      },
      {
        name: 'ContractDataContainer',
        number: 4,
        isActive: false,
        isCompleted: false,
        Component: ContractDataContainer,
        nextStep: '',
      },
    ],
  },
};
