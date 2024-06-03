import '@testing-library/jest-dom';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { act, fireEvent, render } from '../../../config/testUtils';
import AdditionalDataFooter from './AdditionalDataFooter';

describe('AdditionalDataFooter', () => {
  process.env.NX_GLOBAL_CERTIFICATE_REGULARITY = 'CERTIFICATE_REGULARITY';
  const windowOpen = jest.fn();
  window.open = windowOpen;

  beforeEach(() => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.BROKER);
  });

  it('should be able to access the link of certificate of regularity', async () => {
    const { getByTestId } = render(<AdditionalDataFooter />);
    const certificateRegularityButton = getByTestId(
      'additionalDataForm-certificate-regularity-button',
    );
    await act(async () => {
      await fireEvent.click(certificateRegularityButton);
    });
    expect(windowOpen).toHaveBeenCalledWith('CERTIFICATE_REGULARITY', '_blank');
  });

  it('should be able to callback to open the terms and conditions modal', async () => {
    const { getByTestId } = render(<AdditionalDataFooter />);
    const termsModalButton = getByTestId(
      'additionalDataForm-terms-modal-button',
    );
    await act(async () => {
      await fireEvent.click(termsModalButton);
    });
    expect(
      getByTestId('termsOfAcceptanceModal-button-close'),
    ).toBeInTheDocument();
  });

  it('should render send to approval label on submit button if user profile is POLICYHOLDER and doesn`t have issue permission', async () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.POLICYHOLDER);
    jest
      .spyOn(BrokerPlatformAuthService, 'userHasPermission')
      .mockImplementation(() => false);

    const { getByTestId } = render(<AdditionalDataFooter />);
    const submitButton = getByTestId('additionalDataForm-submit-button');
    expect(submitButton).toHaveTextContent('Enviar para aprovação');
  });
});
