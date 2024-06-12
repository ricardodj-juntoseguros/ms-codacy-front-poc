import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import {
  createQuoteMock,
  policyholderDetailsMock,
  quoteResultMock,
} from '../../../__mocks__';
import { DISCLAIMERS } from '../../../constants';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import PolicyInProgress from './PolicyInProgress';

const createOrUpdateQuoteMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => createOrUpdateQuoteMock,
  };
});

describe('PolicyInProgress', () => {
  beforeEach(() => {
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('should be able to define as a policy in progress', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    const { getByTestId } = render(<PolicyInProgress />);
    // Act
    fireEvent.click(getByTestId('policyInProgress-toggle'));
    // Assert
    const state = store.getState();
    expect(state.quote.isPolicyInProgress).toBe(true);
  });

  it('should be able not show the policy in progress toggle if no policyholder has been selected', async () => {
    // Arrange
    const { queryByTestId } = render(<PolicyInProgress />);
    // Act
    // Assert
    expect(
      await queryByTestId('policyInProgress-toggle'),
    ).not.toBeInTheDocument();
  });

  it('should be able to call quote update if you have a valid quote', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByTestId } = render(<PolicyInProgress />);
    // Act
    fireEvent.click(getByTestId('policyInProgress-toggle'));
    // Assert
    const state = store.getState();
    expect(state.quote.isPolicyInProgress).toBe(true);
    expect(createOrUpdateQuoteMock).toHaveBeenCalled();
  });

  it('should be able to show the tooltip with toggle details', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    const { getByTestId, queryByText } = render(<PolicyInProgress />);
    // Act
    await fireEvent.mouseEnter(getByTestId('policyInProgress-tooltip'));
    // Assert
    expect(await queryByText(DISCLAIMERS.policyInProgress)).toBeInTheDocument();
    // Act
    await fireEvent.mouseLeave(getByTestId('policyInProgress-tooltip'));
    // Assert
    expect(
      await queryByText(DISCLAIMERS.policyInProgress),
    ).not.toBeInTheDocument();
  });
});
