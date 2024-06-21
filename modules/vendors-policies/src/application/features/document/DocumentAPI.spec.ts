import { AxiosHttpClient } from '@infrastructure/http-client';
import DocumentAPI from './DocumentAPI';

describe('DocumentAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'vendors_bff';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getPolicyDocument should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return 'OK';
      });
    const result = await DocumentAPI.getPolicyDocument(12345);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/document/policy/12345',
    });
    expect(result).toBe('OK');
  });

  it('getProposalDocuments should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return 'OK';
      });
    const result = await DocumentAPI.getProposalDocuments(12345);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/document/policy/12345/all',
    });
    expect(result).toBe('OK');
  });

  it('getProposalDocument should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return { message: 'ok' };
      });
    const proposalId = 12345;
    const result = await DocumentAPI.getProposalDocument(proposalId);
    expect(mockGet).toHaveBeenCalledWith({
      url: `/api/v1/document/proposal/${proposalId}`,
      headers: {
        Accept: "application/pdf",
      },
      responseType: "arraybuffer",
    });
    expect(result).toEqual({ message: 'ok' });
  });
});
