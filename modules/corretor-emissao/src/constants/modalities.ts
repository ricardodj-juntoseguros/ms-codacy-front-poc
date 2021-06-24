import {
  StepModel,
  Modalities,
  ModalitiesGroup,
  ModalitiesGroupEnum,
} from '../application/types/model';
import { ContractDataContainer } from '../presentation/components/contractDataContainer';
import { RateCalculationContainer } from '../presentation/components/rateCalculationContainer';
import { TimeframeAndCoverageContainer } from '../presentation/components/timeframeAndCoverageContainer';

export const defaultStep: StepModel = {
  name: 'SearchContainer',
  number: 1,
  isActive: true,
  isVisible: true,
  isEnabled: true,
  isLoading: false,
  isCompleted: false,
  nextStep: '',
};

export const groupModalities: ModalitiesGroup = {
  DEFAULT: ModalitiesGroupEnum.DEFAULT,
  EXECUTANTE_CONSTRUTOR: ModalitiesGroupEnum.TRADITIONAL,
  EXECUTANTE_CONSTRUTOR_TERMINO_DE_OBRAS: ModalitiesGroupEnum.TRADITIONAL,
  ANTECIPACAO_DE_RECEBIVEIS_CONTRATUAIS: ModalitiesGroupEnum.TRADITIONAL,
  ADUANEIRO_TRANSITO: ModalitiesGroupEnum.TRADITIONAL,
  REGISTRO_ANELL: ModalitiesGroupEnum.TRADITIONAL,
  PARCELAMENTO_ADMINISTRATIVO_FISCAL: ModalitiesGroupEnum.TRADITIONAL,
  RETENCAO_DE_PAGAMENTO: ModalitiesGroupEnum.TRADITIONAL,
};

export const modalities: Modalities = {
  DEFAULT: {
    steps: [
      {
        name: 'TimeframeAndCoverageContainer',
        number: 2,
        isActive: false,
        isVisible: true,
        isEnabled: false,
        isLoading: false,
        isCompleted: false,
        Component: TimeframeAndCoverageContainer,
        nextStep: 'RateCalculationContainer',
      },
      {
        name: 'RateCalculationContainer',
        number: 3,
        isActive: false,
        isVisible: true,
        isEnabled: false,
        isLoading: false,
        isCompleted: false,
        Component: RateCalculationContainer,
        nextStep: 'ContractDataContainer',
      },
      {
        name: 'ContractDataContainer',
        number: 4,
        isActive: false,
        isVisible: true,
        isEnabled: false,
        isLoading: false,
        isCompleted: false,
        Component: ContractDataContainer,
        nextStep: '',
      },
    ],
  },
  TRADITIONAL: {
    steps: [
      {
        name: 'TimeframeAndCoverageContainer',
        number: 2,
        isActive: false,
        isVisible: true,
        isEnabled: false,
        isLoading: false,
        isCompleted: false,
        Component: TimeframeAndCoverageContainer,
        nextStep: 'RateCalculationContainer',
      },
      {
        name: 'RateCalculationContainer',
        number: 3,
        isActive: false,
        isVisible: true,
        isEnabled: false,
        isLoading: false,
        isCompleted: false,
        Component: RateCalculationContainer,
        nextStep: 'ContractDataContainer',
      },
      {
        name: 'ContractDataContainer',
        number: 4,
        isActive: false,
        isVisible: true,
        isEnabled: false,
        isLoading: false,
        isCompleted: false,
        Component: ContractDataContainer,
        nextStep: '',
      },
    ],
  },
};
