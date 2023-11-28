import {
  ContractDataModel,
  CoverageDataModel,
  FlowModel,
  ModalityModel,
  ModalitySelectionModel,
  PolicyholderModel,
  PolicyholderSelectionModel,
  PricingModel,
  QuoteModel,
  ValidationModel,
} from '../application/types/model';
import { LimitModel } from '../application/types/model/LimitModel';
import { RootState } from '../config/store';
import { parseDateToString } from '../helpers';
import { modalityMock } from './modalityMock';
import { policyholderMock } from './policyholderMock';

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
    modalityOptions: [modalityMock] as Array<ModalityModel>,
  },
  quote: {
    policyholder: policyholderMock as PolicyholderModel,
    modality: modalityMock as ModalityModel,
    submodality: null,
    policyholderAffiliate: null,
    policyholderLimit: {
      limiteDisponivel: 0,
      mensagemLimiteFlexibilizacao: '',
      mensagemLabelLimite: '',
      exibirLimiteFlexibilizacao: false,
      valorLimiteFlexibilizacao: 0,
    } as LimitModel,
    coverageData: {
      startDate: parseDateToString(
        new Date('Fri May 27 2022 17:52:38 GMT-0300 (GMT-03:00)'),
      ),
      endDate: '',
      durationInDays: 0,
      securedAmount: 0,
    } as CoverageDataModel,
    contractData: {} as ContractDataModel,
    identification: null,
    installments: [],
    pricing: {} as PricingModel,
    loadingQuote: false,
    hasQuoteChanges: false,
  } as QuoteModel,
  validation: {
    isValidating: false,
    isValidForm: true,
    errors: {},
  } as ValidationModel,
} as RootState;
