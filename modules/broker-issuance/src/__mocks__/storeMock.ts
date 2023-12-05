import {
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
  validation: {
    isValidating: false,
    isValidForm: true,
    errors: {},
  } as ValidationModel,
} as RootState;
