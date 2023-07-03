import { format } from 'date-fns';
import { StepStatusEnum } from '../application/types/model';
import { modalityListMock } from './modalityListMock';

export const storeMock = {
  flow: {
    steps: [
      {
        name: 'ComponentA',
        status: StepStatusEnum.EDITABLE,
        title: {
          text: 'Olá. Para iniciar uma nova solicitação de garantia, comece preenchendo os %STRONG%',
          boldWords: ['dados do contrato.'],
        },
        infoText: 'Component',
      },
      {
        name: 'ComponentB',
        status: StepStatusEnum.HIDDEN,
        title: {
          text: 'Nessa etapa, precisamos que informe as %STRONG% participantes do contrato.',
          boldWords: ['empresas'],
        },
      },
    ],
  },
  proposal: {
    contractNumber: '',
    contractValue: 0,
    insuredName: '',
    insuredFederalId: '',
    insuredAddressId: 0,
    policyholder: {},
    hasProject: true,
    project: null,
    policyholderContact: {
      id: '',
      name: '',
      email: '',
    },
    initialValidity: format(new Date(), 'dd/MM/yyyy'),
    endValidity: '',
    validityInDays: NaN,
    warrantyPercentage: NaN,
    modality: null,
    additionalCoverageLabor: false,
  },
  projectSelection: {
    projectSearchValue: '',
    projectOptions: [
      {
        id: 1,
        name: 'Lorem',
      },
    ],
    projectOptionsMapped: [
      {
        id: 1,
        name: 'Lorem',
        label: 'Lorem',
        value: '1',
      },
    ],
  },
  validation: {
    isValidating: false,
    isValidForm: true,
    errors: {},
  },
  modalitySelection: {
    modalityOptions: modalityListMock,
    modalityOptionsMapped: [
      {
        modalityId: 96,
        externalDescription: 'Executante construtor',
        allowsAdditionalCoverageLabor: true,
        submodalities: [
          {
            subModalityId: 90,
            externalDescription: 'Convencional',
          },
        ],
        label: 'Executante construtor',
        value: '96',
      },
      {
        modalityId: 73,
        externalDescription: 'Adiantamento de pagamento',
        allowsAdditionalCoverageLabor: false,
        submodalities: [
          {
            subModalityId: 1,
            externalDescription: 'Convencional',
          },
        ],
        label: 'Adiantamento de pagamento',
        value: '73',
      },
    ],
    modalityOptionsLoading: false,
  },
  insuredAndPolicyholderSelection: {
    policyholderInputValue: '33646384000173',
  },
};
