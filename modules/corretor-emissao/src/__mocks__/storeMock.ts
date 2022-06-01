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
    policyholderOptions: [],
    loadingSearchPolicyholder: false,
    subsidiaryOptions: [],
    loadingDetails: false,
    loadingGetSubsidiaries: false,
  } as PolicyholderSelectionModel,
  modalitySelecion: {
    modalityOptions: [
      {
        id: 48,
        externalDescription: 'Registro ANEEL',
        externalId: 82,
        description: 'Registro ANEEL - 477',
        labelNoticeContract: 'N° Edital / Contrato',
        labelNoticeAnnex: 'Anexo do Edital',
        helpNoticeContract:
          'No preenchimento do campo N.° Edital/Contrato, observar o seguinte: a) Caso o Contrato já esteja assinado, preencher o campo com o número do Contrato; b) Caso o Contrato ainda não tenha sido assinado, preencher o campo com a seguinte frase, sem aspas: "a ser assinado, referente ao Edital n.° (AQUI DEVERÁ SER PREENCHIDO COM O NÚMERO REAL DO EDITAL REFERENTE A ESTA PROPOSTA)"; c) Após o preenchimento, caso esteja no GOL Clássico, clique no link abaixo, caso esteja na Nova Plataforma, faça a impressão da Minuta, para visualizar o texto formatado no Objeto da apólice. Caso não esteja de forma harmônica, revisar preenchimento do campo do N.° Edital / Contrato ou entre em contato com a Regional que lhe atende.',
        helpNoticeAnnex:
          'Esta caixa deve ser preenchida somente para os processos dos Segurados DER/SP e SABESP. Neste campo deve ser informado o Número do Anexo / Modelo previsto nos Editais do DER/SP e da SABESP. A descrição desta caixa será impressa nas condições particulares do documento. Após o preenchimento, clicar no link "Clique aqui para visualizar as Condições Particulares". CASO NÃO SE TRATE DE UM PROCESSO DOS SEGURADOS DER/SP E SABESP, DEIXAR ESTA CAIXA EM BRANCO. ',
        isJudicial: false,
        allowsAdditionalCoverageLabor: false,
        allowsAdditionalCoverageGuarantee: false,
        allowsAdditionalCoverageVigilance: false,
        retroactiveDays: 90,
        showAuctionNoticeFields: false,
        submodalityExternalIdForCoverageLabor: 0,
        submodalityExternalIdForCoverageGuarantee: 0,
        typeId: 0,
        typeDescription: 'Modalidades Tradicionais',
        label: 'Registro ANEEL',
      },
    ],
    loadingGetModalities: false,
  } as ModalitySelectionModel,
  quote: {
    policyholder: policyholderMock as PolicyholderModel,
    modality: modalityMock as ModalityModel,
    submodality: null,
    subsidiary: null,
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
  flow: {
    steps: [
      {
        name: 'Search',
        number: 1,
        isActive: true,
        isVisible: true,
        isEnabled: true,
        isLoading: false,
        isCompleted: false,
        nextStep: 'CoverageData',
      },
      {
        name: 'CoverageData',
        number: 2,
        isActive: false,
        isVisible: true,
        isEnabled: false,
        isLoading: false,
        isCompleted: false,
        nextStep: 'RateCalculation',
      },
      {
        name: 'RateCalculation',
        number: 3,
        isActive: false,
        isVisible: true,
        isEnabled: false,
        isLoading: false,
        isCompleted: false,
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
        nextStep: '',
      },
    ],
  } as FlowModel,
} as RootState;
