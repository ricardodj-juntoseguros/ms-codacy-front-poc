import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import { store } from '../../../config/store';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { policyholderMock } from '../../../__mocks__';
import { PolicyRenewalTypeEnum } from '../../../application/types/model';
import PolicyRenewalApi from '../../../application/features/policyRenewal/PolicyRenewalApi';
import { policyRenewalActions } from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import { DISCLAIMERS } from '../../../constants';
import PolicyRenewal from './PolicyRenewal';

describe('PolicyRenewal', () => {
  process.env.NX_GLOBAL_ENDORSEMENT_URL = '';
  const windowOpen = jest.fn();
  window.open = windowOpen;

  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(policyRenewalActions.resetPolicyRenewal());
  });

  it('should be able to allow the user to choose the type of renewal of an ongoing contract', async () => {
    // Arrange
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    const { getByTestId } = render(<PolicyRenewal />);
    // Act
    await fireEvent.click(getByTestId('policyRenewal-toggle-show'));
    const onGoingProcessRadio = getByTestId(
      'policyRenewal-onGoingProcess-radio-button',
    );
    await expect(onGoingProcessRadio).toBeInTheDocument();
    fireEvent.click(onGoingProcessRadio);
    const state = store.getState().policyRenewal;
    // Assert
    expect(state.isPolicyRenewal).toBe(true);
    expect(state.policyRenewalType).toBe(PolicyRenewalTypeEnum.OnGoingProcess);
  });

  it('should be able to allow the user to choose the type of renewal from another insurer', async () => {
    // Arrange
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    const { getByTestId } = render(<PolicyRenewal />);
    // Act
    await fireEvent.click(getByTestId('policyRenewal-toggle-show'));
    const belongsToAnotherInsuranceCompanyRadio = getByTestId(
      'policyRenewal-belongsToAnotherInsuranceCompany-radio-button',
    );
    await expect(belongsToAnotherInsuranceCompanyRadio).toBeInTheDocument();
    fireEvent.click(belongsToAnotherInsuranceCompanyRadio);
    const state = store.getState().policyRenewal;
    // Assert
    expect(state.isPolicyRenewal).toBe(true);
    expect(state.policyRenewalType).toBe(
      PolicyRenewalTypeEnum.BelongsToAnotherInsuranceCompany,
    );
  });

  it('should be able to allow the user to choose to renew an internal policy and see the status of the policy', async () => {
    // Arrange
    const verifyPolicyMock = jest
      .spyOn(PolicyRenewalApi, 'verifyPolicy')
      .mockImplementation(() =>
        Promise.resolve({
          documentNumber: 12312312312,
          message: '',
          needEndorsement: false,
        }),
      );
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    const { getByTestId } = render(<PolicyRenewal />);
    // Act
    fireEvent.click(getByTestId('policyRenewal-toggle-show'));
    const belongsToOurCompanyRadio = getByTestId(
      'policyRenewal-belongsToOurCompany-radio-button',
    );
    await expect(belongsToOurCompanyRadio).toBeInTheDocument();
    fireEvent.click(belongsToOurCompanyRadio);
    const mainPolicyNumberInput = getByTestId(
      'policyRenewal-policyNumber-input',
    );
    await expect(mainPolicyNumberInput).toBeInTheDocument();
    fireEvent.change(mainPolicyNumberInput, {
      target: { value: '01-0775-0472216' },
    });
    fireEvent.blur(mainPolicyNumberInput);
    const state = store.getState().policyRenewal;
    await waitFor(async () => {
      await expect(state.mainPolicyNumber).toEqual('01-0775-0472216');
      await expect(verifyPolicyMock).toHaveBeenCalledWith(
        '01-0775-0472216',
        180988,
      );
    });
  });

  it('should be able to allow the user to choose to renew an internal policy and not search the status if the policy number is incomplete', async () => {
    // Arrange
    const verifyPolicyMock = jest
      .spyOn(PolicyRenewalApi, 'verifyPolicy')
      .mockImplementation(() =>
        Promise.resolve({
          documentNumber: 12312312312,
          message: '',
          needEndorsement: false,
        }),
      );
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    const { getByTestId } = render(<PolicyRenewal />);
    // Act
    fireEvent.click(getByTestId('policyRenewal-toggle-show'));
    const belongsToOurCompanyRadio = getByTestId(
      'policyRenewal-belongsToOurCompany-radio-button',
    );
    await expect(belongsToOurCompanyRadio).toBeInTheDocument();
    fireEvent.click(belongsToOurCompanyRadio);
    const mainPolicyNumberInput = getByTestId(
      'policyRenewal-policyNumber-input',
    );
    await expect(mainPolicyNumberInput).toBeInTheDocument();
    fireEvent.change(mainPolicyNumberInput, {
      target: { value: '01-0775-047221' },
    });
    fireEvent.blur(mainPolicyNumberInput);
    const state = store.getState().policyRenewal;
    await waitFor(async () => {
      await expect(state.mainPolicyNumber).toEqual('01-0775-047221');
      await expect(verifyPolicyMock).not.toHaveBeenCalled();
    });
  });

  it('should allow the user to be redirected to the endorsement flow if internal and current policy', async () => {
    // Arrange
    const verifyPolicyMock = jest
      .spyOn(PolicyRenewalApi, 'verifyPolicy')
      .mockImplementation(() =>
        Promise.resolve({
          documentNumber: 12312312312,
          message:
            'Verificamos que a apólice está vigente. Nesse caso você precisa seguir via endosso.',
          needEndorsement: true,
        }),
      );
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    const { getByTestId } = render(<PolicyRenewal />);
    // Act
    fireEvent.click(getByTestId('policyRenewal-toggle-show'));
    const belongsToOurCompanyRadio = getByTestId(
      'policyRenewal-belongsToOurCompany-radio-button',
    );
    await expect(belongsToOurCompanyRadio).toBeInTheDocument();
    fireEvent.click(belongsToOurCompanyRadio);
    const mainPolicyNumberInput = getByTestId(
      'policyRenewal-policyNumber-input',
    );
    await expect(mainPolicyNumberInput).toBeInTheDocument();
    fireEvent.change(mainPolicyNumberInput, {
      target: { value: '01-0775-0472216' },
    });
    fireEvent.blur(mainPolicyNumberInput);
    const state = store.getState().policyRenewal;
    await waitFor(async () => {
      await expect(state.mainPolicyNumber).toEqual('01-0775-0472216');
      await expect(verifyPolicyMock).toHaveBeenCalledWith(
        '01-0775-0472216',
        180988,
      );
    });
    const startEndorsementButton = getByTestId(
      'policyRenewal-startEndorsement-button',
    );
    fireEvent.click(startEndorsementButton);
    expect(windowOpen).toHaveBeenCalledWith(
      '/search?documentNumber=12312312312',
      '_blank',
    );
  });

  it('should be able to show tooltip message', async () => {
    const { getByTestId, queryByText } = render(<PolicyRenewal />);
    fireEvent.mouseEnter(getByTestId('policyRenewal-tooltip'));
    expect(await queryByText(DISCLAIMERS.policyRenewal)).toBeInTheDocument();
    fireEvent.mouseLeave(getByTestId('policyRenewal-tooltip'));
    expect(
      await queryByText(DISCLAIMERS.policyRenewal),
    ).not.toBeInTheDocument();
  });

  it('Should disable toggle and hide tooltip if is fidelize prospection', async () => {
    await store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    store.dispatch(quoteSliceActions.setIsFidelizeProspection(true));
    const { getByTestId, queryByTestId } = render(<PolicyRenewal />);
    expect(getByTestId('policyRenewal-toggle-show')).toBeDisabled();
    expect(queryByTestId('policyRenewal-tooltip')).not.toBeInTheDocument();
  });
});
