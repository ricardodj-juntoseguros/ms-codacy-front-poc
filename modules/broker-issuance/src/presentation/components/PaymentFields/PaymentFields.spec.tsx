import '@testing-library/jest-dom';
import { addDays, startOfDay } from 'date-fns';
import { MAX_DAYS_FOR_FIRST_DUE_DATE } from 'modules/broker-issuance/src/constants';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { store } from '../../../config/store';
import { putProposal } from '../../../application/features/proposal/ProposalSlice';
import {
  createQuoteMock,
  modalityBidderMock,
  proposalMock,
  quoteResulMock,
} from '../../../__mocks__';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import PaymentFields from './PaymentFields';
import { fireEvent, render } from '../../../config/testUtils';
import { parseDateToString } from '../../../helpers';

const createOrUpdateQuoteMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => createOrUpdateQuoteMock,
  };
});

describe('PaymentsFields', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await store.dispatch(quoteSliceActions.setModality(modalityBidderMock));
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResulMock);
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
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
  });
  it('should be able to select the payment type', () => {
    const { getByText } = render(<PaymentFields />);
    fireEvent.click(getByText('Boleto'));
    const state = store.getState();
    expect(state.proposal.paymentType).toEqual({
      label: 'Boleto',
      value: '1',
    });
  });

  it('should be able to select the number of installments', () => {
    const { getByText } = render(<PaymentFields />);
    fireEvent.click(getByText(/À vista em/i));
    const state = store.getState();
    expect(state.proposal.numberOfInstallments).toEqual({
      label: 'À vista em R$ 190,00',
      value: '1',
    });
  });

  it('should be able to select the date of the first due date', () => {
    const todayFormatted = parseDateToString(startOfDay(new Date()));
    const { getByTestId } = render(<PaymentFields />);
    const firstDueDateInput = getByTestId(
      'paymentFields-first-due-date-input-dropdown',
    );
    fireEvent.change(firstDueDateInput, {
      target: { value: todayFormatted },
    });
    const state = store.getState();
    expect(state.proposal.firstDueDate).toEqual(todayFormatted);
    expect(createOrUpdateQuoteMock).toHaveBeenCalled();
  });

  it('should be able to display an error if a first due date greater than the default maximum date is entered', () => {
    const todayFormatted = parseDateToString(
      startOfDay(addDays(new Date(), MAX_DAYS_FOR_FIRST_DUE_DATE + 1)),
    );
    const { getByTestId, getByText } = render(<PaymentFields />);
    const firstDueDateInput = getByTestId(
      'paymentFields-first-due-date-input-dropdown',
    );
    fireEvent.change(firstDueDateInput, {
      target: { value: todayFormatted },
    });
    const state = store.getState();
    expect(state.proposal.firstDueDate).toEqual(todayFormatted);
    expect(
      getByText('A data é maior que a data máxima especificada'),
    ).toBeInTheDocument();
  });

  it('should be able to display an error if a first due date is entered that is greater than the duration of days in the quote', async () => {
    await store.dispatch(quoteSliceActions.setDurationInDays(5));
    const todayFormatted = parseDateToString(
      startOfDay(addDays(new Date(), 6)),
    );
    const { getByTestId, getByText } = render(<PaymentFields />);
    const firstDueDateInput = getByTestId(
      'paymentFields-first-due-date-input-dropdown',
    );
    fireEvent.change(firstDueDateInput, {
      target: { value: todayFormatted },
    });
    const state = store.getState();
    expect(state.proposal.firstDueDate).toEqual(todayFormatted);
    expect(
      getByText('A data é maior que a data máxima especificada'),
    ).toBeInTheDocument();
  });
});
