import '@testing-library/jest-dom';
import { policyRenewalActions } from 'modules/broker-issuance/src/application/features/policyRenewal/PolicyRenewalSlice';
import { PolicyRenewalTypeEnum } from 'modules/broker-issuance/src/application/types/model';
import { fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import {
  modalityBidderMock,
  modalityServiceProfiderPerformerMock,
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

  it('should be able to disable the button if it is renewal and the user has not chosen the type', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    await store.dispatch(policyRenewalActions.setIsPolicyRenewal(true));
    const { getByTestId } = render(
      <form onSubmit={submitMock}>
        <PolicyholderAndModalityFooter />
      </form>,
    );
    // Act
    // Assert
    const submitButton = getByTestId('policyholderAndModality-submit-button');
    expect(submitButton).toBeDisabled();
  });

  it('should be able to disable the button if the user has chosen the internal policy option and has not entered the policy number correctly.', async () => {
    // Arrange
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    await store.dispatch(policyRenewalActions.setIsPolicyRenewal(true));
    await store.dispatch(
      policyRenewalActions.setPolicyRenewalType(
        PolicyRenewalTypeEnum.BelongsToOurCompany,
      ),
    );
    await store.dispatch(policyRenewalActions.setMainPolicyNumber('123456'));
    const { getByTestId } = render(
      <form onSubmit={submitMock}>
        <PolicyholderAndModalityFooter />
      </form>,
    );
    // Act
    // Assert
    const submitButton = getByTestId('policyholderAndModality-submit-button');
    expect(submitButton).toBeDisabled();
  });
});
