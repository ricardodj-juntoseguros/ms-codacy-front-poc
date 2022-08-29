import { AxiosHttpClient } from '@infrastructure/http-client';
import BrokerContactApi from './BrokerContactApi';

describe('OpportunitiesDetailsApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_FIDELIZE_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sendBrokerContactLead should call bff service correctly', async () => {
    const httpMock = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { success: true };
      });

    await BrokerContactApi.sendBrokerContactLead(
      'teste@mail.com',
      'Test question',
    );
    expect(httpMock).toHaveBeenCalledWith({
      url: '/v1/contacts/leads',
      payload: {
        leadEmails: ['teste@mail.com'],
        leadQuestion: 'Test question',
      },
    });
  });
});
