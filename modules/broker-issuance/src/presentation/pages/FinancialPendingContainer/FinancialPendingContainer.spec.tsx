import * as reactRedux from 'react-redux';
import { fireEvent, render } from '../../../config/testUtils';
import {
  insuredMock,
  modalityBidderMock,
  quoteResultMock,
  storeMock,
} from '../../../__mocks__';
import FinancialPendingContainer from './FinancialPendingContainer';

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => ({
  ...(jest.requireActual('react-router') as any),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
const windowOpen = jest.fn();
window.open = windowOpen;
describe('TermsOfAcceptanceModal', () => {
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
      durationInDays: 365,
      securedAmount: 1000000,
      endDateValidity: '14/11/2024',
      startDateValidity: '14/11/2023',
      totalPrize: 2600,
      currentQuote: quoteResultMock,
      modality: modalityBidderMock,
      policyholder: {
        ...storeMock.quote.policyholder,
        economicGroupId: 63076,
        economicGroupName: 'TOMADOR TESTE – SQUAD DESACOPLAMENTO',
      },
    },
    proposal: {
      identification: {
        PolicyId: 4236048,
      },
      insured: insuredMock,
      insuredAddress: insuredMock.addresses[0],
      loadingProposal: false,
      createProposalSuccess: false,
      hasProposalChanges: true,
      biddingDescription: '98765',
      biddingNumber: '12345',
    },
  };
  process.env.NX_GLOBAL_BILLS_PLATFORM = '';

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  });

  it('should be able to close a modal', async () => {
    render(<FinancialPendingContainer />);
    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should be able to close a modal', async () => {
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<FinancialPendingContainer />);
    const button = getByTestId(
      'financialPendingContainer-button-redirect-to-bills',
    );
    fireEvent.click(button);
    expect(windowOpen).toHaveBeenCalledWith(
      '?cnpj=91833813000118&status=vencido',
      '_blank',
    );
  });
});
