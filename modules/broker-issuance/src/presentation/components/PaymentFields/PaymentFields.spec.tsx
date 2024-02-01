import '@testing-library/jest-dom';
import { addDays, format, startOfDay } from 'date-fns';
import {
  MAX_DAYS_FOR_FIRST_DUE_DATE,
  MIN_DAYS_FOR_FIRST_DUE_DATE,
} from 'modules/broker-issuance/src/constants';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { store } from '../../../config/store';
import { putProposal } from '../../../application/features/proposal/ProposalSlice';
import {
  createQuoteMock,
  modalityBidderMock,
  proposalMock,
  quoteResultMock,
} from '../../../__mocks__';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import PaymentFields from './PaymentFields';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import { parseDateToString } from '../../../helpers';
import CanAuthorizeApi from '../../../application/features/canAuthorize/CanAuthorizeApi';

const createOrUpdateQuoteMock = jest.fn();
const updateProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => createOrUpdateQuoteMock,
    useProposal: () => updateProposalMock,
  };
});

describe('PaymentFields', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await store.dispatch(quoteSliceActions.setModality(modalityBidderMock));
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    jest.spyOn(ProposalApi, 'putProposal').mockImplementation(() =>
      Promise.resolve({
        ProposalId: 12345,
        PolicyId: 11111,
        QuotationId: 12223,
        NewQuoterId: 123333,
        createdAt: '2021-01-01T00:00:00',
      }),
    );
    jest.spyOn(CanAuthorizeApi, 'getCanAuthorize').mockImplementation(() =>
      Promise.resolve({
        isAutomaticPolicy: true,
        issueMessage: '',
        hasOnlyFinancialPending: false,
      }),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    await store.dispatch(
      quoteSliceActions.setEndDateValidity(
        format(addDays(new Date(), 30), 'dd/MM/yyyy'),
      ),
    );
  });

  it('should be able to select the payment type', () => {
    const { getByText } = render(<PaymentFields />);
    fireEvent.click(getByText('Boleto'));
    const state = store.getState();
    expect(state.proposal.paymentType).toEqual(1);
  });

  it('should be able to select the number of installments', () => {
    const { getByText } = render(<PaymentFields />);
    fireEvent.click(getByText(/À vista em/i));
    const state = store.getState();
    expect(state.proposal.numberOfInstallments).toEqual(1);
  });

  it('should be able to select the date of the first due date and update quote', async () => {
    const dateToSet = parseDateToString(
      startOfDay(addDays(new Date(), MIN_DAYS_FOR_FIRST_DUE_DATE)),
    );
    const { getByTestId } = render(<PaymentFields />);
    const firstDueDateInput = getByTestId('paymentFields-first-due-date-input');
    fireEvent.change(firstDueDateInput, {
      target: { value: dateToSet },
    });
    const state = store.getState();
    expect(state.proposal.firstDueDate).toEqual(dateToSet);
    await waitFor(() => {
      expect(updateProposalMock).toHaveBeenCalled();
      expect(createOrUpdateQuoteMock).toHaveBeenCalled();
    });
  });

  it('should be able to display an error if a first due date greater than the default maximum date is entered', () => {
    const dateToSet = parseDateToString(
      startOfDay(addDays(new Date(), MAX_DAYS_FOR_FIRST_DUE_DATE + 1)),
    );
    const { getByTestId, getByText } = render(<PaymentFields />);
    const firstDueDateInput = getByTestId('paymentFields-first-due-date-input');
    fireEvent.change(firstDueDateInput, {
      target: { value: dateToSet },
    });
    const state = store.getState();
    expect(state.proposal.firstDueDate).toEqual(dateToSet);
    expect(
      getByText('A data é maior que a data máxima especificada'),
    ).toBeInTheDocument();
  });
});
