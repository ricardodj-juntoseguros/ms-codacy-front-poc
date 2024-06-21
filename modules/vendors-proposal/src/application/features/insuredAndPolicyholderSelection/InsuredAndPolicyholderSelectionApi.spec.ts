import { AxiosHttpClient } from '@infrastructure/http-client';
import {
  insuredAddressesMock,
  insuredListMock,
  policyholderAffiliatesMock,
  policyholdersMock,
} from '../../../__mocks__';
import InsuredAndPolicyholderSelectionApi from './InsuredAndPolicyholderSelectionApi';

describe('InsuredAndPolicyholderSelectionApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  it('getInsuredList should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementationOnce(async () => insuredListMock);

    const result = await InsuredAndPolicyholderSelectionApi.getInsuredList();

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/insureds',
    });

    expect(result).toStrictEqual(insuredListMock);
  });

  it('getInsuredAddresses should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementationOnce(async () => insuredAddressesMock);

    const result = await InsuredAndPolicyholderSelectionApi.getInsuredAddresses(
      '11223344556677',
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/insureds/11223344556677/addresses',
    });
    expect(result).toStrictEqual(insuredAddressesMock);
  });

  it('getPolicyholders should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementationOnce(async () => policyholdersMock);

    const result = await InsuredAndPolicyholderSelectionApi.getPolicyholders(
      '11223344556677',
      'Teste tomador',
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/policyholder',
      params: {
        federalId: '11223344556677',
        corporateName: 'Teste tomador',
      },
    });
    expect(result).toStrictEqual(policyholdersMock);
  });

  it('getPolicyholderAffiliates should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementationOnce(async () => policyholderAffiliatesMock);

    const result =
      await InsuredAndPolicyholderSelectionApi.getPolicyholderAffiliates(
        '11223344556677',
      );

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/policyholder/affiliates',
      params: {
        federalId: '11223344556677',
      },
    });
    expect(result).toStrictEqual(policyholderAffiliatesMock);
  });
});
