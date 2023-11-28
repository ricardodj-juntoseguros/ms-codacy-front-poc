import { AxiosHttpClient } from '@infrastructure/http-client';
import { modalityMock } from '../../../__mocks__';
import ModalitySelectionApi from './ModalitySelecionApi';

describe('ModalitySelectionApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fetchModalitiesMock = jest.spyOn(
    ModalitySelectionApi,
    'fetchModalities',
  );

  it('should not broke retreveing the modalities', () => {
    const policyholderFederalId = '99999999999999';
    const brokerFederalId = '8888888888888';
    const response =
      ModalitySelectionApi.fetchModalities(brokerFederalId, policyholderFederalId);
    expect(fetchModalitiesMock).toHaveBeenCalled();
    expect(response).resolves.not.toThrow();
  });

  it('getPolicyholderDetails should call bff service correctly', async () => {
    const policyholderFederalId = '99999999999999';
    const brokerFederalId = '8888888888888';
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return modalityMock;
      });

    const result = await ModalitySelectionApi.fetchModalities(
      brokerFederalId, policyholderFederalId,
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: `/v1/products/policyholder/${policyholderFederalId}/modalities?brokerFederalId=${brokerFederalId}`,
    });
    expect(result).toBe(modalityMock);
  });
});
