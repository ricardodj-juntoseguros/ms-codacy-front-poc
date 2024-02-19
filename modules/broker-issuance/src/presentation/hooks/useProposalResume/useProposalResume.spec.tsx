/* eslint-disable prefer-promise-reject-errors */
import { renderHook } from '@testing-library/react-hooks';
import Router from 'react-router';
import { Provider } from 'react-redux';
import {
  ThemeProvider,
  Themes,
  ToastContainer,
  makeToast,
} from 'junto-design-system';
import { Broker, BrokerPlatformAuthService, ProfileEnum } from '@services';
import { store } from '../../../config/store';
import { useProposalResume } from './useProposalResume';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import {
  insuredMock,
  modalityBidderMock,
  modalityDefaultMock,
  policyholderDetailsMock,
  policyholderSearchMock,
  proposalResumeMock,
} from '../../../__mocks__';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import ModalitySelecionApi from '../../../application/features/modalitySelection/ModalitySelecionApi';
import { policyholderSelectionActions } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import InsuredSelectionApi from '../../../application/features/insuredSelection/InsuredSelectionApi';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

describe('UseProposalResume Hook', () => {
  const HookWrapper: React.FC = ({ children }) => {
    return (
      <ThemeProvider theme={Themes.DEFAULT}>
        <Provider store={store}>{children}</Provider>
        <ToastContainer />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockImplementation(() => {
        return {
          externalId: 268010,
          federalId: '11111111111111',
        } as Broker;
      });
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.BROKER);
    store.dispatch(policyholderSelectionActions.clearPolicyholderSelection());
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('Should render error toast if api returns 404 while fetching proposal details', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ identification: '123456' });
    jest.spyOn(ProposalApi, 'getProposalResume').mockImplementation(() =>
      Promise.reject({
        status: 404,
      }),
    );

    const { result, waitFor } = renderHook(() => useProposalResume(), {
      wrapper: HookWrapper,
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
    expect(ProposalApi.getProposalResume).toHaveBeenLastCalledWith(123456);
    expect(makeToast).toHaveBeenCalled();
  });

  it('Should render error toast if api returns 403 while fetching proposal details', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ identification: '123456' });
    jest.spyOn(ProposalApi, 'getProposalResume').mockImplementation(() =>
      Promise.reject({
        status: 403,
      }),
    );

    const { result, waitFor } = renderHook(() => useProposalResume(), {
      wrapper: HookWrapper,
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
    expect(ProposalApi.getProposalResume).toHaveBeenLastCalledWith(123456);
    expect(makeToast).toHaveBeenLastCalledWith('error', 'Acesso Negado');
  });

  it('Should render error toast if api fails while fetching proposal details', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ identification: '123456' });
    jest.spyOn(ProposalApi, 'getProposalResume').mockImplementation(() =>
      Promise.reject({
        status: 500,
      }),
    );

    const { result, waitFor } = renderHook(() => useProposalResume(), {
      wrapper: HookWrapper,
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
    expect(ProposalApi.getProposalResume).toHaveBeenLastCalledWith(123456);
    expect(makeToast).toHaveBeenLastCalledWith(
      'error',
      'Ocorreu um erro ao recuperar os dados do documento.',
    );
  });

  it('Should be able to rehydrate all stores correctly with an valid identification', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ identification: '1401096' });

    const getProposalMock = jest
      .spyOn(ProposalApi, 'getProposalResume')
      .mockImplementation(async () => proposalResumeMock);

    const policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(async () => {
        return {
          ...policyholderSearchMock,
          records: [
            { federalId: '97837181000147', name: 'DEXCO S.A', id: 123 },
            ...policyholderSearchMock.records,
          ],
        };
      });

    const policyholderDetailsApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(async () => {
        return policyholderDetailsMock;
      });

    const modalityApiMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(async () => {
        return [modalityBidderMock];
      });

    const insuredSearchMock = jest
      .spyOn(InsuredSelectionApi, 'searchInsured')
      .mockImplementation(async () => {
        return { hasMore: false, records: [insuredMock] };
      });

    const { result, waitFor } = renderHook(() => useProposalResume(), {
      wrapper: HookWrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(getProposalMock).toHaveBeenLastCalledWith(1401096);

    // Asserts policyholder and affiliate selection rehydrate
    expect(policyholderSearchApiMock).toHaveBeenLastCalledWith(
      '97837181000147',
    );
    expect(policyholderDetailsApiMock).toHaveBeenLastCalledWith(
      268010,
      '97837181000147',
    );
    const {
      policyholderSelection,
      quote,
      modalitySelecion,
      insuredSelection,
      proposal,
    } = store.getState();
    expect(policyholderSelection.policyholderOptions.length).toBe(3);
    expect(policyholderSelection.affiliatesOptions.length).toBe(3);
    expect(policyholderSelection.policyholderSearchValue).toEqual(
      '97.837.181/0001-47 - DEXCO S.A',
    );
    expect(quote.policyholder).not.toBeNull();
    expect(quote.policyholderAffiliate).not.toBeNull();

    // Asserts modality selection rehydrate
    expect(modalityApiMock).toHaveBeenLastCalledWith(
      '11111111111111',
      '97837181000147',
    );
    expect(modalitySelecion.modalityOptions).toHaveLength(1);
    expect(quote.modality).not.toBeNull();

    // Asserts other quote data
    expect(quote.securedAmount).toEqual(45000);
    expect(quote.durationInDays).toEqual(120);

    // Asserts insured selection rehydrate
    expect(insuredSearchMock).toHaveBeenLastCalledWith(insuredMock.name);
    expect(insuredSelection.insuredOptions).toHaveLength(1);
    expect(insuredSelection.insuredAddressesOptions).toHaveLength(8);
    expect(insuredSelection.insuredSearchValue).toBe(
      'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
    );

    // Asserts proposal rehydrate
    expect(proposal.insured).not.toBeNull();
    expect(proposal.insuredAddress).not.toBeNull();
    expect(proposal.biddingNumber).toEqual('12324');
    expect(proposal.biddingDescription).toEqual('40028922');
    expect(proposal.identification?.PolicyId).toEqual(4276847);
  });

  it('Should display error toast if policyholder search returns no results', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ identification: '1401096' });

    const getProposalMock = jest
      .spyOn(ProposalApi, 'getProposalResume')
      .mockImplementation(async () => proposalResumeMock);

    const policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(async () => {
        return {
          ...policyholderSearchMock,
          records: [],
        };
      });

    const { result, waitFor } = renderHook(() => useProposalResume(), {
      wrapper: HookWrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(getProposalMock).toHaveBeenLastCalledWith(1401096);
    expect(policyholderSearchApiMock).toHaveBeenLastCalledWith(
      '97837181000147',
    );
    expect(makeToast).toHaveBeenLastCalledWith(
      'error',
      'Dados do tomador não encontrados.',
    );
  });

  it('Should display error toast if policyholder details fails', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ identification: '1401096' });

    const getProposalMock = jest
      .spyOn(ProposalApi, 'getProposalResume')
      .mockImplementation(async () => proposalResumeMock);

    jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(async () => {
        return {
          ...policyholderSearchMock,
          records: [
            { federalId: '97837181000147', name: 'DEXCO S.A', id: 123 },
            ...policyholderSearchMock.records,
          ],
        };
      });

    const policyholderDetailsApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(async () => {
        return Promise.reject();
      });

    const { result, waitFor } = renderHook(() => useProposalResume(), {
      wrapper: HookWrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(getProposalMock).toHaveBeenLastCalledWith(1401096);
    expect(policyholderDetailsApiMock).toHaveBeenLastCalledWith(
      268010,
      '97837181000147',
    );
    expect(makeToast).toHaveBeenLastCalledWith(
      'error',
      'Houve um erro inesperado ao buscar os dados do tomador desta proposta.',
    );
  });

  it('Should display error toast if returned proposal modality is not available', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ identification: '1401096' });

    const getProposalMock = jest
      .spyOn(ProposalApi, 'getProposalResume')
      .mockImplementation(async () => proposalResumeMock);

    jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(async () => {
        return {
          ...policyholderSearchMock,
          records: [
            { federalId: '97837181000147', name: 'DEXCO S.A', id: 123 },
            ...policyholderSearchMock.records,
          ],
        };
      });

    jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(async () => {
        return policyholderDetailsMock;
      });

    const modalityApiMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(async () => {
        return [modalityDefaultMock];
      });

    const { result, waitFor } = renderHook(() => useProposalResume(), {
      wrapper: HookWrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(getProposalMock).toHaveBeenLastCalledWith(1401096);
    expect(modalityApiMock).toHaveBeenLastCalledWith(
      '11111111111111',
      '97837181000147',
    );
    expect(makeToast).toHaveBeenLastCalledWith(
      'error',
      'Modalidade do documento inválida',
    );
  });

  it('Should display error toast if insured search does not return records', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ identification: '1401096' });

    const getProposalMock = jest
      .spyOn(ProposalApi, 'getProposalResume')
      .mockImplementation(async () => proposalResumeMock);

    jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(async () => {
        return {
          ...policyholderSearchMock,
          records: [
            { federalId: '97837181000147', name: 'DEXCO S.A', id: 123 },
            ...policyholderSearchMock.records,
          ],
        };
      });

    jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(async () => {
        return policyholderDetailsMock;
      });

    jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(async () => {
        return [modalityBidderMock];
      });

    const insuredSearchMock = jest
      .spyOn(InsuredSelectionApi, 'searchInsured')
      .mockImplementation(async () => {
        return { hasMore: false, records: [] };
      });

    const { result, waitFor } = renderHook(() => useProposalResume(), {
      wrapper: HookWrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(getProposalMock).toHaveBeenLastCalledWith(1401096);
    expect(insuredSearchMock).toHaveBeenLastCalledWith(
      'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
    );
    expect(makeToast).toHaveBeenLastCalledWith(
      'error',
      'Dados do segurado da proposta não encontrados.',
    );
  });
});
