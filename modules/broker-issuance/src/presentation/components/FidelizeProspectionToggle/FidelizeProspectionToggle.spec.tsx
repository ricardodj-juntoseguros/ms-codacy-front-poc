import '@testing-library/jest-dom';
import {
  createQuoteMock,
  policyholderMock,
  quoteResultMock,
} from '../../../__mocks__';
import { fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { policyRenewalActions } from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import FidelizeProspectionToggle from './FidelizeProspectionToggle';
import { DISCLAIMERS } from '../../../constants';

const mockHook = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => mockHook,
  };
});

describe('FidelizeProspectionToggle', () => {
  beforeAll(async () => {
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
  });

  beforeEach(() => {
    store.dispatch(policyRenewalActions.setIsPolicyRenewal(false));
  });

  it('Should change value on store on toggle change', async () => {
    const { getByTestId } = render(<FidelizeProspectionToggle />);
    const toggle = getByTestId('fidelizeProspection-toggle');
    fireEvent.click(toggle);
    expect(store.getState().quote.isFidelizeProspection).toBe(true);
    fireEvent.click(toggle);
    expect(store.getState().quote.isFidelizeProspection).toBe(false);
  });

  it('Should have toggle disabled if policy in progress', async () => {
    store.dispatch(quoteSliceActions.toggleIsPolicyInProgress());
    const { getByTestId } = render(<FidelizeProspectionToggle />);
    const toggle = getByTestId('fidelizeProspection-toggle');
    expect(toggle).toBeDisabled();
  });

  it('Should have toggle disabled if policy renewal', async () => {
    store.dispatch(quoteSliceActions.toggleIsPolicyInProgress());
    store.dispatch(policyRenewalActions.setIsPolicyRenewal(true));
    const { getByTestId } = render(<FidelizeProspectionToggle />);
    const toggle = getByTestId('fidelizeProspection-toggle');
    expect(toggle).toBeDisabled();
  });

  it('Should not render tooltip button if toggle is disabled', async () => {
    store.dispatch(quoteSliceActions.toggleIsPolicyInProgress());
    const { queryByTestId } = render(<FidelizeProspectionToggle />);
    expect(
      queryByTestId('fidelizeProspectionToggle-tooltip'),
    ).not.toBeInTheDocument();
  });

  it('Should open and close tooltip on button mouse over and leave', async () => {
    store.dispatch(quoteSliceActions.toggleIsPolicyInProgress());
    const { getByTestId, queryByText } = render(<FidelizeProspectionToggle />);
    const tooltipButton = getByTestId('fidelizeProspectionToggle-tooltip');
    fireEvent.mouseOver(tooltipButton);
    expect(queryByText(DISCLAIMERS.fidelizeProspection)).toBeInTheDocument();
    fireEvent.mouseLeave(tooltipButton);
    expect(
      queryByText(DISCLAIMERS.fidelizeProspection),
    ).not.toBeInTheDocument();
  });

  it('Should update an current quotation on toggle change', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByTestId } = render(<FidelizeProspectionToggle />);
    const toggle = getByTestId('fidelizeProspection-toggle');
    fireEvent.click(toggle);
    expect(mockHook).toHaveBeenCalled();
  });
});
