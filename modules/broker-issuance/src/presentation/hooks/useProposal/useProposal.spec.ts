import * as reactRedux from 'react-redux';
import { BrokerPlatformAuthService } from '@services';
import { renderHook } from '@testing-library/react-hooks';
import { brokerMock, insuredMock, quoteResulMock, storeMock } from '../../../__mocks__';
import { useProposal } from './useProposal';

const mockValidate = jest.fn(
  () => new Promise((resolve, reject) => resolve(true)),
);

jest.mock('../useValidate', () => {
  const rest = jest.requireActual('../useValidate');
  return {
    ...rest,
    useValidate: () => mockValidate,
  };
});

describe('useProposal', () => {
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const updatedStoreMock = {
    ...storeMock,
    quote: {
      ...storeMock.quote,
      identification: {
        ProposalId: 12345,
        QuotationId: 12223,
        NewQuoterId: 123333,
      },
      startDateValidity: '01/01/2025',
      endDateValidity: '01/01/2026',
      durationInDays: 365,
      securedAmount: 150000,
      currentQuote: quoteResulMock,
    },
    proposal: {
      identification: {
        PolicyId: 12345,
      },
      insured: insuredMock,
      insuredAddress: insuredMock.addresses[0],
      biddingNumber: '123456',
      biddingDescription: '12345',
      loadingProposal: false,
      createProposalSuccess: false,
      hasProposalChanges: true,
    },
    contractualCondition: {
      currentContractualCondition: null,
      requestedBy: 1,
      text: 'Teste',
      openContractualConditions: true,
      loadingContractualCondition: false,
      hasContractualConditionsChanges: true,
    }
  };

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to create a proposal if all information is filled in', async () => {
    useSelectorMock.mockImplementation(select =>
      select({
        ...updatedStoreMock,
        contractualCondition: {
          ...updatedStoreMock.contractualCondition,
          text: '',
          requestedBy: null,
          currentContractualCondition: null,
        }
      }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { result } = renderHook(() => useProposal());
    await result.current();
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('should be able to create a proposal and custom clause if all information is filled in', async () => {
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { result } = renderHook(() => useProposal());
    await result.current();
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(3);
  });

  it('should be able to create a proposal and update custom clause if all information is filled in', async () => {
    useSelectorMock.mockImplementation(select =>
      select({
        ...updatedStoreMock,
        contractualCondition: {
          ...updatedStoreMock.contractualCondition,
          currentContractualCondition: {
            id: 12345,
            requestedBy: 1,
            text: 'Teste',
          },
        }
      }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { result } = renderHook(() => useProposal());
    await result.current();
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(3);
  });

  it('should not create a proposal if there is no quote or modality selected', async () => {
    useSelectorMock.mockImplementation(select =>
      select({
        ...updatedStoreMock,
        quote: {
          ...updatedStoreMock.quote,
          currentQuote: null,
          modality: null,
        }
      }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { result } = renderHook(() => useProposal());
    await result.current();
    expect(mockValidate).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
