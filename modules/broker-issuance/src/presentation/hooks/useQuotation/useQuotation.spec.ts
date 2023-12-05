import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { Broker, BrokerPlatformAuthService } from '@services';
import * as reactRedux from 'react-redux';
import { quoteResulMock, storeMock } from '../../../__mocks__';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import { useQuotation } from './useQuotation';

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

describe('useQuotation Hook', () => {
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  const updatedStoreMock = {
    ...storeMock,
    quote: {
      ...storeMock.quote,
      startDateValidity: '01/01/2025',
      endDateValidity: '01/01/2026',
      durationInDays: 365,
      securedAmount: 150000,
    },
  };

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
    jest.spyOn(BrokerPlatformAuthService, 'getBroker').mockReturnValue({
      federalId: '111111111111',
    } as Broker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should validate and create a new quotation if store does not have a current quote', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResulMock);
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { result } = renderHook(() => useQuotation());
    await result.current();
    expect(mockValidate).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('Should validate and update a quotation if store have a current quote and has quote changes', async () => {
    const updatedStoreMockWithCurrentQuote = {
      ...updatedStoreMock,
      quote: {
        currentQuote: quoteResulMock,
        hasQuoteChanges: true,
        proposalFee: 0.26,
      },
    };
    jest
      .spyOn(QuoteApi, 'putQuotation')
      .mockImplementation(async () => quoteResulMock);
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMockWithCurrentQuote }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { result } = renderHook(() => useQuotation());
    await result.current();
    expect(mockValidate).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });
});
