import { AxiosHttpClient } from '@infrastructure/http-client';
import SearchInsuredApi from './SearchInsuredApi';


describe('QuoteApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generateQuote should call bff service correctly', async () => {

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return {};
      });


   await SearchInsuredApi.searchInsured('teste');

    expect(mockGet).toHaveBeenCalledWith({
      url: '/insured?insuredName=teste'
    });

  });
});
