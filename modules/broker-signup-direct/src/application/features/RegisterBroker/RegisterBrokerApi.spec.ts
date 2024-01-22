import { AxiosHttpClient } from '@infrastructure/http-client';
import {
  registerBrokerDTOMock,
  registerBrokerNewUserDTOMock,
  verifyTokenDTOMock,
  surveyDTOMock,
} from '../../../__mocks__';

import RegisterBrokerApi from './RegisterBrokerApi';

describe('RegisterBrokerApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('RegisterBrokerApi must call the registerBroker method correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return '1a9ee217a1b7';
      });

    const result = await RegisterBrokerApi.registerBroker(
      registerBrokerDTOMock,
    );

    expect(mockPost).toHaveBeenCalledWith({
      url: '/brokers/signup',
      payload: registerBrokerDTOMock,
    });
    expect(result).toBe('1a9ee217a1b7');
  });

  it('RegisterBrokerApi must call the updateRegisterBroker method correctly', async () => {
    const mockPatch = jest
      .spyOn(AxiosHttpClient.prototype, 'patch')
      .mockImplementation(async () => {
        return '1a9ee217a1b7';
      });

    const result = await RegisterBrokerApi.updateRegisterBroker(
      registerBrokerDTOMock,
      '1a9ee217a1b7',
    );

    expect(mockPatch).toHaveBeenCalledWith({
      url: '/brokers/signup?id=1a9ee217a1b7',
      payload: registerBrokerDTOMock,
    });
    expect(result).toBe('1a9ee217a1b7');
  });

  it('RegisterBrokerApi must call the checkEmailExists method correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return true;
      });

    const result = await RegisterBrokerApi.checkEmailExists(
      'teste@juntoseguros.com',
    );

    expect(mockGet).toHaveBeenCalledWith({
      url: `/brokers/users/exists?email=teste@juntoseguros.com`,
    });
    expect(result).toBeTruthy;
  });

  it('RegisterBrokerApi must call the SendValidationEmail method correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return true;
      });

    const result = await RegisterBrokerApi.SendValidationEmail('1a9ee217a1b7');

    expect(mockGet).toHaveBeenCalledWith({
      url: `/brokers/signup/validation/email?id=1a9ee217a1b7`,
    });
    expect(result).toBeTruthy;
  });

  it('RegisterBrokerApi must call the createNewUser method correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return true;
      });

    const result = await RegisterBrokerApi.createNewUser(
      registerBrokerNewUserDTOMock,
    );

    expect(mockPost).toHaveBeenCalledWith({
      url: `/api_policies/brokers/create/newuser`,
      payload: registerBrokerNewUserDTOMock,
    });
    expect(result).toBeTruthy;
  });

  it('RegisterBrokerApi must call the isSimpleOptant method correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return true;
      });

    const result = await RegisterBrokerApi.isSimpleOptant('91382861000137');

    expect(mockGet).toHaveBeenCalledWith({
      url: `/signup/broker/91382861000137`,
    });
    expect(result).toBeTruthy;
  });

  it('RegisterBrokerApi must call the verifyTokenValiditySignupInternalized method correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return verifyTokenDTOMock;
      });

    const result =
      await RegisterBrokerApi.verifyTokenValiditySignupInternalized(
        '91382861000137',
      );

    expect(mockGet).toHaveBeenCalledWith({
      url: `/api_policies/brokers/create/continue/91382861000137`,
    });
    expect(result).toEqual(verifyTokenDTOMock);
  });

  it('RegisterBrokerApi must call the sendEmailSignupInternalized method correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return true;
      });

    const result = await RegisterBrokerApi.sendEmailSignupInternalized(
      '91382861000137',
    );

    expect(mockPost).toHaveBeenCalledWith({
      url: `/brokers/signup/email?userId=91382861000137`,
    });
    expect(result).toBeTruthy;
  });

  it('RegisterBrokerApi must call the sendSatisfactionSurvey method correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return true;
      });

    const result = await RegisterBrokerApi.sendSatisfactionSurvey(
      surveyDTOMock,
    );

    expect(mockPost).toHaveBeenCalledWith({
      url: `/ms-customer-surveys/api/v1/actions/159753824568/answers`,
      payload: surveyDTOMock,
    });
    expect(result).toBeTruthy;
  });
});
