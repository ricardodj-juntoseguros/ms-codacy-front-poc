import { AxiosHttpClient } from '@infrastructure/http-client';
import {
  validateBankAccountDTOMock,
  ListBanksMock,
  ValidateBankAccountRespondeModelMock,
} from 'modules/broker-signup-direct/src/__mocks__';

import ListBankApi from './ListBankApi';

describe('ListBankApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ListBankApi must call the getBanks method correctly', async () => {
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

  it('ListBankApi must call the getBanks method correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return ValidateBankAccountRespondeModelMock;
      });

    const result = await ListBankApi.validateBankAccount(
      validateBankAccountDTOMock,
    );

    expect(mockPost).toHaveBeenCalledWith({
      url: '/ms-bank-account-validator/api/bankAccount/basic',
      payload: validateBankAccountDTOMock,
    });
    expect(result).toBe(ValidateBankAccountRespondeModelMock);
  });
});
