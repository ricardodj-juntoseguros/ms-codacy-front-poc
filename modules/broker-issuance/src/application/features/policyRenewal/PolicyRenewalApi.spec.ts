import { AxiosHttpClient } from '@infrastructure/http-client';
import PolicyRenewalApi from './PolicyRenewalApi';
import { renewalDocumentListMock } from '../../../__mocks__';

describe('PolicyRenewalApi', () => {
  it('should be able to verify policy', async () => {
    const mockResult = {
      documentNumber: 12312312312,
      message: '',
      needEndorsement: false,
    };
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return mockResult;
      });
    const result = await PolicyRenewalApi.verifyPolicy('12312312312', 12345);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/policies/12312312312/policyholder/12345/verify',
    });
    expect(result).toEqual(mockResult);
  });

  it('should be able get renewal document list', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return renewalDocumentListMock;
      });
    const result = await PolicyRenewalApi.getRenewalDocumentList();
    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/policies/renewal/documents',
    });
    expect(result).toEqual(renewalDocumentListMock);
  });
});
