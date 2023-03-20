import { AxiosHttpClient } from '@infrastructure/http-client';
import {ListBanksMock}  from 'modules/broker-signup/src/__mocks__';
import ListBankApi from './ListBankApi';

describe('ListBankApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ListBankApi should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return ListBanksMock;
      });

    const result = await ListBankApi.getBanks();

    expect(mockGet).toHaveBeenCalledWith({
      url: '/ms-bank-account-validator/api/bank',
    });
    expect(result).toBe(ListBanksMock);
  });
});
