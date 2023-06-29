import { AxiosHttpClient } from '@infrastructure/http-client';
import { TermsMock } from '../../../__mocks__/index';
import TermsApi from './TermsApi';

describe('TermsApi', () => {
  const nameTermMock = 'term-mock';

  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAcceptTerms should call bff service correctly', async () => {
    const emailMock = 'teste@teste.com.br';

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return TermsMock;
      });

    const result = await TermsApi.getAcceptTerms(emailMock, nameTermMock);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/terms/byUserType?email=teste@teste.com.br&description=term-mock',
    });
    expect(result).toBe(TermsMock);
  });

  it('getTerm should call bff service correctly', async () => {
    const versionMock = '1.0';
    const termTextMock =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id placerat felis. Aliquam vestibulum nibh et erat tempus, malesuada cursus risus venenatis.';

    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return termTextMock;
      });

    const result = await TermsApi.getTerm(TermsMock);

    expect(mockGet).toHaveBeenCalledWith({
      url: `api/v1/terms?version=1.1&description=termo-de-responsabilidade-vendors`,
    });
    expect(result).toBe(termTextMock);
  });

  it('postAccept should call bff service correctly', async () => {
    const emailMock = 'teste@teste.com.br';
    const termId = 1.1;

    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return {};
      });

    await TermsApi.postAccept(emailMock, termId);

    expect(mockPost).toHaveBeenCalledWith({
      url: `/api/v1/terms/accept`,
      payload: {
        email: emailMock,
        termId,
      },
    });
  });
});
