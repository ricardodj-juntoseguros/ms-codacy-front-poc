import { AxiosHttpClient } from '@infrastructure/http-client';
import QuoteApi from './QuoteApi';
import { QuoteDTO } from '../../types/dto/QuoteDTO';
import { quoteResulMock, quoteMock } from '../../../__mocks__';

describe('QuoteApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generateQuote should call bff service correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return quoteResulMock;
      });

    const result = await QuoteApi.generateQuote(quoteMock);

    expect(mockPost).toHaveBeenCalledWith({
      payload: quoteMock,
      url: `ms-middleware-proposal/api/quotation`,
    });
    expect(result).toBe(quoteResulMock);
  });
});
