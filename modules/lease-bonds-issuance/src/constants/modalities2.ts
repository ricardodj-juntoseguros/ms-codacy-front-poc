import {
  StepModel,
  Modalities,
  ModalitiesGroup,
  ModalitiesGroupEnum,
} from '../application/types/model';

export const defaultStep: StepModel = {
  name: 'Search',
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
  EXECUTANTE_CONSTRUTOR: ModalitiesGroupEnum.COMMON,
  EXECUTANTE_CONSTRUTOR_TERMINO_DE_OBRAS: ModalitiesGroupEnum.COMMON,
  ANTECIPACAO_DE_RECEBIVEIS_CONTRATUAIS: ModalitiesGroupEnum.COMMON,
  ADUANEIRO_TRANSITO: ModalitiesGroupEnum.COMMON,
  REGISTRO_ANELL: ModalitiesGroupEnum.COMMON,
  PARCELAMENTO_ADMINISTRATIVO_FISCAL: ModalitiesGroupEnum.COMMON,
  RETENCAO_DE_PAGAMENTO: ModalitiesGroupEnum.COMMON,
  CONTA_RESERVA: ModalitiesGroupEnum.COMMON,
  ADMINISTRATIVO_CREDITO_TRIBUTARIO: ModalitiesGroupEnum.COMMON,
  EXECUTANTE_CONCESSIONARIO: ModalitiesGroupEnum.COMMON,
  ADIANTAMENTO_DE_PAGAMENTO: ModalitiesGroupEnum.COMMON,
  PROCESSO_ADMINISTRATIVO: ModalitiesGroupEnum.COMMON,
};

export const modalities: Modalities = {
  DEFAULT: {
    validationSchema: 'common',
    steps: [
    ],
  },
  COMMON: {
    validationSchema: 'common',
    steps: [
    ],
  },
};
