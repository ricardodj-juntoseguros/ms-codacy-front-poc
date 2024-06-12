import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import {
  modalityBidderMock,
  policyholderDetailsMock,
} from '../../../__mocks__';
import PolicyholderAndModalityFooter from './PolicyholderAndModalityFooter';

describe('PolicyholderAndModalityFooter', () => {
  const submitMock = jest.fn();

  it('should be able to call the submit function correctly', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(quoteSliceActions.setModality(modalityBidderMock));
    const { getByTestId } = render(
      <form onSubmit={submitMock}>
        <PolicyholderAndModalityFooter />
      </form>,
    );
    // Act
    const submitButton = getByTestId('policyholderAndModality-submit-button');
    fireEvent.click(submitButton);
    // Assert
    expect(submitButton).not.toBeDisabled();
    expect(submitMock).toHaveBeenCalled();
  });
});
