import { AxiosHttpClient } from '@infrastructure/http-client';
import { RDLeadBrokerSignupDTOMock } from 'modules/broker-signup-direct/src/__mocks__';
import RDStationAPI from './RDStationAPI';

describe('RDStationAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('RDStationAPI should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return '';
      });

    await RDStationAPI.authRDBrokerSignup();

    expect(mockGet).toHaveBeenCalled();
  });

  it('RDStationAPI should call bff service correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return '';
      });

    await RDStationAPI.addLeadBrokerSignup(RDLeadBrokerSignupDTOMock);

    expect(mockPost).toHaveBeenCalled();
  });
});
