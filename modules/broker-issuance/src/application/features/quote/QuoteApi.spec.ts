import { AxiosHttpClient } from '@infrastructure/http-client';
import QuoteApi from './QuoteApi';
import { quoteResultMock, createQuoteMock } from '../../../__mocks__';

describe('QuoteApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('postQuotation should call bff service correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return quoteResultMock;
      });

    const result = await QuoteApi.postQuotation(createQuoteMock);

    expect(mockPost).toHaveBeenCalledWith({
      url: `/v1/quotation`,
      payload: createQuoteMock,
    });
    expect(result).toBe(quoteResultMock);
  });

  it('putQuotation should call bff service correctly', async () => {
    const mockPut = jest
      .spyOn(AxiosHttpClient.prototype, 'put')
      .mockImplementation(async () => {
        return quoteResultMock;
      });

    const result = await QuoteApi.putQuotation(12345, createQuoteMock);

    expect(mockPut).toHaveBeenCalledWith({
      url: '/v1/quotation/12345',
      payload: createQuoteMock,
    });
    expect(result).toBe(quoteResultMock);
  });

  it('getQuotationDocument should call bff service correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return 'Ok';
      });

    const result = await QuoteApi.getQuotationDocument(12345);

    expect(mockPost).toHaveBeenCalledWith({
      url: `/v1/quotation/12345/document`,
      headers: {
        Accept: 'application/pdf',
      },
      responseType: 'arraybuffer',
    });
    expect(result).toBe('Ok');
  });
});
