import { AxiosHttpClient } from '@infrastructure/http-client';
import PreApprovalAPI from './PreApprovalAPI';

describe('PreApprovalAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('get proposal should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return { message: 'sucess' };
      });

    const response = await PreApprovalAPI.getProposal(1);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/proposal/policy/1',
    });

    expect(response).toEqual({ message: 'sucess' });
  });

  it('refuse proposal should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { message: 'sucess' };
      });

    const payload = {
      GuidCode: 123,
      DocumentNumber: 123,
      Approve: false,
      Observation: 'Observation',
      ClientCommunication: false,
      VisaibleCommission: false,
      negativeReason: '',
    };

    const response = await PreApprovalAPI.refuseProposal(payload);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/issue/refuse',
      payload: { ...payload },
    });

    expect(response).toEqual({ message: 'sucess' });
  });

  it('approve proposal should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { message: 'sucess' };
      });

    const response = await PreApprovalAPI.approveProposal(1);

    expect(mockGet).toHaveBeenCalledWith({
      headers: { 'x-forwarded-for': '' },
      url: '/api/v1/issue/approve',
      payload: {},
    });

    expect(response).toEqual({ message: 'sucess' });
  });
});
