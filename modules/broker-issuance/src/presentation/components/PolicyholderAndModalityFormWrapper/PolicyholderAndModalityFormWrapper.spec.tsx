import { BrokerPlatformAuthService } from '@services';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import {
  brokerMock,
  createQuoteMock,
  modalityServiceProfiderPerformerMock,
  policyholderMock,
  quoteResultMock,
} from '../../../__mocks__';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { store } from '../../../config/store';
import { policyRenewalActions } from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import PolicyholderAndModalityFormWrapper from './PolicyholderAndModalityFormWrapper';

const advanceStepMock = jest.fn();
jest.mock('@shared/hooks', () => {
  const originalModule = jest.requireActual('@shared/hooks');
  return {
    __esModule: true,
    ...originalModule,
    useFlow: () => ({
      advanceStep: advanceStepMock,
    }),
  };
});

describe('PolicyholderAndModalityFormWrapper', () => {
  beforeAll(() => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);
  });

  it('should be able to call the submit function correctly', () => {
    const { getByText } = render(
      <PolicyholderAndModalityFormWrapper name="test">
        <button type="submit">submit</button>
      </PolicyholderAndModalityFormWrapper>,
    );
    fireEvent.click(getByText('submit'));
    expect(advanceStepMock).toHaveBeenCalledWith('test');
  });

  it('should be able to update a quote if necessary and move on to the next step', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    const putQuotationMock = jest
      .spyOn(QuoteApi, 'putQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    await store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    await store.dispatch(quoteSliceActions.setSecuredAmount(1000));
    await store.dispatch(quoteSliceActions.setDurationInDays(365));
    await store.dispatch(postQuotation(createQuoteMock));
    await store.dispatch(policyRenewalActions.setHasPolicyRenewalChanges(true));
    const { getByText } = render(
      <PolicyholderAndModalityFormWrapper name="test">
        <button type="submit">submit</button>
      </PolicyholderAndModalityFormWrapper>,
    );
    fireEvent.click(getByText('submit'));
    await waitFor(async () => {
      const state = store.getState().policyRenewal;
      expect(state.hasPolicyRenewalChanges).toBeFalsy();
      expect(putQuotationMock).toHaveBeenCalled();
      expect(advanceStepMock).toHaveBeenCalledWith('test');
    });
  });
});
