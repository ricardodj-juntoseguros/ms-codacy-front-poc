import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { store } from '../../../config/store';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import {
  createQuoteMock,
  insuredMock,
  modalityBidderMock,
  policyholderMock,
  quoteResultMock,
} from '../../../__mocks__';
import { PolicyholderAffiliatesModel } from '../../../application/types/model';
import { useFormSummary } from './useFormSummary';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import { QuoteResultDTO } from '../../../application/types/dto';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import { contractualConditionActions } from '../../../application/features/contractualCondition/ContractualConditionSlice';
import { policyholderSelectionActions } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import { proposalDocumentsActions } from '../../../application/features/proposalDocuments/ProposalDocumentsSlice';

describe('UseFormSummary hook', () => {
  const HookWrapper: React.FC = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return correct summary data for PolicyholderAndModalityForm', () => {
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    store.dispatch(
      quoteSliceActions.setPolicyholderAffiliate({
        id: 1234,
        companyName: 'TOMADOR TESTE – SQUAD DESACOPLAMENTO',
        city: 'CURITIBA',
        state: 'PR',
        federalId: '97.837.181/0020-00',
      } as PolicyholderAffiliatesModel),
    );
    store.dispatch(quoteSliceActions.setModality(modalityBidderMock));
    const { result } = renderHook(() => useFormSummary(), {
      wrapper: HookWrapper,
    });
    const data = result.current.getSummaryData('PolicyholderAndModalityForm');
    expect(data.length).toBe(4);
    expect(data[0].label).toEqual('CNPJ');
    expect(data[0].value).toEqual('91.833.813/0001-18');
    expect(data[1].label).toEqual('Razão Social');
    expect(data[1].value).toEqual('TOMADOR TESTE – SQUAD DESACOPLAMENTO');
    expect(data[2].label).toEqual('Filial');
    expect(data[2].value).toEqual('97.837.181/0020-00');
    expect(data[3].label).toEqual('Modalidade');
    expect(data[3].value).toEqual('Licitante');
  });

  it('Should return correct summary data for ValidityAndValueForm', async () => {
    const quoteResultMockUpdated: QuoteResultDTO = {
      ...quoteResultMock,
      pricing: {
        ...quoteResultMock.pricing,
        feeFlexEnabled: true,
        feeFlex: 10,
        commissionFlexEnabled: true,
        commissionFlex: 100,
      },
    };
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMockUpdated);
    store.dispatch(quoteSliceActions.setStartDateValidity('01/01/2024'));
    store.dispatch(quoteSliceActions.setEndDateValidity('31/01/2024'));
    store.dispatch(quoteSliceActions.setSecuredAmount(120000));
    await store.dispatch(postQuotation(createQuoteMock));
    const { result } = renderHook(() => useFormSummary(), {
      wrapper: HookWrapper,
    });
    const data = result.current.getSummaryData('ValidityAndValueForm');
    expect(data.length).toBe(8);
    expect(data[0].label).toEqual('Vigência');
    expect(data[0].value).toEqual('01/01/2024 - 31/01/2024');
    expect(data[1].label).toEqual('Total de dias');
    expect(data[1].value).toEqual('30 dias');
    expect(data[2].label).toEqual('Total da cobertura');
    expect(data[2].value).toEqual('R$ 120.000,00');
    expect(data[3].label).toEqual('Prêmio');
    expect(data[3].value).toEqual('R$ 190,00');
    expect(data[4].label).toEqual('Comissão');
    expect(data[4].value).toEqual('R$ 38,00 (20%)');
    expect(data[5].label).toEqual('Taxa padrão');
    expect(data[5].value).toEqual('0,26%');
    expect(data[6].label).toEqual('Comissão flex');
    expect(data[6].value).toEqual('R$ 100,00');
    expect(data[7].label).toEqual('Taxa flex');
    expect(data[7].value).toEqual('10,00%');
  });

  it('Should return correct summary data for ValidityAndValueForm profile policyholder', async () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockReturnValue(ProfileEnum.POLICYHOLDER);
    const quoteResultMockUpdated: QuoteResultDTO = {
      ...quoteResultMock,
      pricing: {
        ...quoteResultMock.pricing,
        feeFlexEnabled: true,
        feeFlex: 10,
        commissionFlexEnabled: true,
        commissionFlex: 100,
      },
    };
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMockUpdated);
    store.dispatch(quoteSliceActions.setStartDateValidity('01/01/2024'));
    store.dispatch(quoteSliceActions.setEndDateValidity('31/01/2024'));
    store.dispatch(quoteSliceActions.setSecuredAmount(120000));
    await store.dispatch(postQuotation(createQuoteMock));
    const { result } = renderHook(() => useFormSummary(), {
      wrapper: HookWrapper,
    });
    const data = result.current.getSummaryData('ValidityAndValueForm');
    expect(data.length).toBe(3);
    expect(data[0].label).toEqual('Vigência');
    expect(data[0].value).toEqual('01/01/2024 - 31/01/2024');
    expect(data[1].label).toEqual('Total de dias');
    expect(data[1].value).toEqual('30 dias');
    expect(data[2].label).toEqual('Total da cobertura');
    expect(data[2].value).toEqual('R$ 120.000,00');
  });

  it('Should return correct summary data for InsuredDataForm', async () => {
    store.dispatch(proposalActions.setInsured(insuredMock));
    store.dispatch(
      proposalActions.setInsuredAddress({
        ...insuredMock.addresses[0],
        label: 'RUA SAO CLEMENTE 360 - RIO DE JANEIRO, RJ',
        value: '5539',
      }),
    );
    store.dispatch(proposalActions.setBiddingNumber('123456'));
    store.dispatch(proposalActions.setBiddingDescription('98765'));
    store.dispatch(
      contractualConditionActions.setOpenContractualConditions(true),
    );
    store.dispatch(contractualConditionActions.setRequestedBy('1'));
    const { result } = renderHook(() => useFormSummary(), {
      wrapper: HookWrapper,
    });
    const data = result.current.getSummaryData('InsuredDataForm');
    expect(data.length).toBe(6);
    expect(data[0].label).toEqual('CNPJ');
    expect(data[0].value).toEqual('42.498.733/0001-48');
    expect(data[1].label).toEqual('Razão Social');
    expect(data[1].value).toEqual(
      'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
    );
    expect(data[2].label).toEqual('Endereço');
    expect(data[2].value).toEqual('RUA SAO CLEMENTE 360 - RIO DE JANEIRO, RJ');
    expect(data[3].label).toEqual('Número do Edital');
    expect(data[3].value).toEqual('123456');
    expect(data[4].label).toEqual('Anexo do Edital');
    expect(data[4].value).toEqual('98765');
    expect(data[5].label).toEqual('Condições');
    expect(data[5].value).toEqual('Novo ou modificado (Tomador)');
  });

  it('Should return correct summary data for AdditionalDataForm', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    store.dispatch(proposalActions.setNumberOfInstallments(1));
    store.dispatch(proposalActions.setPaymentType(1));
    store.dispatch(proposalActions.setFirstDueDate('01/01/2024'));
    const { result } = renderHook(() => useFormSummary(), {
      wrapper: HookWrapper,
    });
    const data = result.current.getSummaryData('AdditionalDataForm');
    expect(data.length).toBe(4);
    expect(data[0].label).toEqual('Prêmio total');
    expect(data[0].value).toEqual('R$ 190,00');
    expect(data[1].label).toEqual('Forma de pagamento');
    expect(data[1].value).toEqual('Boleto');
    expect(data[2].label).toEqual('Quantidade de parcelas');
    expect(data[2].value).toEqual('À vista em R$ 190,00');
    expect(data[3].label).toEqual('Primeira parcela');
    expect(data[3].value).toEqual('01/01/2024');
  });

  it('Should return correct documents summary for all documents', () => {
    store.dispatch(
      policyholderSelectionActions.setCurrentAppointmentLetter({
        filename: 'carta-nomeacao.pdf',
        size: 200000,
      }),
    );
    store.dispatch(
      proposalDocumentsActions.setDocuments([
        {
          size: 200000,
          url: 'test_url',
          name: 'documento-proposta.pdf',
        },
      ]),
    );
    const { result } = renderHook(() => useFormSummary(), {
      wrapper: HookWrapper,
    });
    const data = result.current.uploadedDocumentsSummary;
    expect(data.length).toBe(2);
    expect(data[0].filename).toBe('carta-nomeacao.pdf');
    expect(data[0].size).toBe('0.19 MB');
    expect(data[1].filename).toBe('documento-proposta.pdf');
    expect(data[0].size).toBe('0.19 MB');
  });
});
