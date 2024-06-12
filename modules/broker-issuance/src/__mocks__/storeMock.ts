import {
  ContractualConditionModel,
  ModalityModel,
  PolicyholderModel,
  PolicyholderSelectionModel,
  QuoteModel,
  ValidationModel,
} from '../application/types/model';
import { RootState } from '../config/store';
import { modalityDefaultMock } from './modalityMock';
import { policyholderMock } from './policyholderMock';
import { submodalityMock } from './submodalityMock';

export const storeMock = {
  policyholderSelection: {
    policyholderSearchValue: '',
    isValidFederalId: false,
    policyholderOptions: [],
    loadingSearchPolicyholder: false,
    affiliatesOptions: [],
    loadingDetails: false,
    loadingGetSubsidiaries: false,
    currentAppointmentLetter: null,
    needAppointmentLetter: false,
  } as PolicyholderSelectionModel,
  modalitySelecion: {
    modalityOptions: [modalityDefaultMock] as Array<ModalityModel>,
  },
  quote: {
    policyholder: policyholderMock as PolicyholderModel,
    modality: modalityDefaultMock as ModalityModel,
    submodality: submodalityMock,
    policyholderAffiliate: null,
    loadingQuote: false,
    hasQuoteChanges: false,
  } as QuoteModel,
  contractualCondition: {
    loadingContractualCondition: false,
    contractualCondition: null,
    requestedBy: null,
    text: '',
    openContractualConditions: false,
    currentContractualCondition: null,
    hasContractualConditionsChanges: false,
  } as ContractualConditionModel,
  validation: {
    isValidating: false,
    isValidForm: true,
    errors: {},
  } as ValidationModel,
} as RootState;
