import { AxiosHttpClient } from '@infrastructure/http-client';
import { modalityMock } from '../../../__mocks__';
import ModalitySelectionApi from './ModalitySelecionApi';

describe('ModalitySelectionApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getModalitiesByPolicyholderMock = jest.spyOn(
    ModalitySelectionApi,
    'getModalitiesByPolicyholder',
  );

  it('should not broke retreveing the modalities', () => {
    const policyHolderId = 140139;
    const response =
      ModalitySelectionApi.getModalitiesByPolicyholder(policyHolderId);
    expect(getModalitiesByPolicyholderMock).toHaveBeenCalled();
    expect(response).resolves.not.toThrow();
  });

  it('getPolicyholderDetails should call bff service correctly', async () => {
    const policyHolderId = 140139;
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return modalityMock;
      });

    const result = await ModalitySelectionApi.getModalitiesByPolicyholder(
      policyHolderId,
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: `api_policyholder/policyholders/${policyHolderId}/modalities-to-policyholder`,
    });
    expect(result).toBe(modalityMock);
  });
});
