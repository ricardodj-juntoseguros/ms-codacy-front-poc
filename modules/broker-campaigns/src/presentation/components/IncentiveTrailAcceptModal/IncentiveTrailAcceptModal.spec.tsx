import '@testing-library/jest-dom';
import { makeToast } from 'junto-design-system';
import { render, fireEvent, waitFor } from '../../../config/testUtils';
import IncentiveTrailApi from '../../../application/features/incentiveTrail/IncentiveTrailApi';
import IncentiveTrailAcceptModal from './IncentiveTrailAcceptModal';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

jest.mock('react-gtm-module', () => {
  return {
    ...(jest.requireActual('react-gtm-module') as any),
    dataLayer: jest.fn(),
  };
});

describe('IncentiveTrailAcceptModal', () => {
  const onCloseModal = jest.fn();
  const onGetIncentiveTrailCampaignData = jest.fn();
  const campaignId = 1;
  const windowOpen = jest.fn();
  window.open = windowOpen;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should be able to accept the terms', async () => {
    const mockPost = jest
      .spyOn(IncentiveTrailApi, 'postAcceptIncentiveTrail')
      .mockImplementation(async () => Promise.resolve());
    const { getByTestId } = render(
      <IncentiveTrailAcceptModal
        onCloseModal={onCloseModal}
        onGetIncentiveTrailCampaignData={onGetIncentiveTrailCampaignData}
        toogleModal
        campaignId={campaignId}
      />,
    );
    fireEvent.click(getByTestId('incentiveTrailAcceptModal-checkbox-terms'));
    fireEvent.click(getByTestId('incentiveTrailAcceptModal-button-submit'));
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(campaignId);
      expect(onCloseModal).toHaveBeenCalled();
      expect(onGetIncentiveTrailCampaignData).toHaveBeenCalled();
    });
  });

  it('should be able to close the modal', async () => {
    const { getByTestId } = render(
      <IncentiveTrailAcceptModal
        onCloseModal={onCloseModal}
        onGetIncentiveTrailCampaignData={onGetIncentiveTrailCampaignData}
        toogleModal
        campaignId={campaignId}
      />,
    );
    fireEvent.click(getByTestId('modal-backdrop'));
    fireEvent.click(getByTestId('modal-close-button'));
    await waitFor(() => {
      expect(onCloseModal).toHaveBeenCalledTimes(3);
    });
  });

  it('should redirect to the terms campaign', () => {
    const { getByTestId } = render(
      <IncentiveTrailAcceptModal
        onCloseModal={onCloseModal}
        onGetIncentiveTrailCampaignData={onGetIncentiveTrailCampaignData}
        toogleModal
        campaignId={campaignId}
      />,
    );
    fireEvent.click(
      getByTestId('incentiveTrailAcceptModal-linkButton-redirect-terms'),
    );
    expect(windowOpen).toHaveBeenCalledWith(
      'https://static.juntoseguros.com/docs/Regulamento-Programa-de-Incentivo-Trilha-de-Incentivo-2024.pdf',
      '_blank',
    );
  });

  it('', async () => {
    const mockPost = jest
      .spyOn(IncentiveTrailApi, 'postAcceptIncentiveTrail')
      .mockImplementation(async () => Promise.reject());

    const { getByTestId } = render(
      <IncentiveTrailAcceptModal
        onCloseModal={onCloseModal}
        onGetIncentiveTrailCampaignData={onGetIncentiveTrailCampaignData}
        toogleModal
        campaignId={campaignId}
      />,
    );
    fireEvent.click(getByTestId('incentiveTrailAcceptModal-checkbox-terms'));
    fireEvent.click(getByTestId('incentiveTrailAcceptModal-button-submit'));
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(campaignId);
      expect(makeToast).toHaveBeenCalledWith(
        'error',
        'Houve um erro ao aceitar os termos da campanha',
      );
    });
  });
});
