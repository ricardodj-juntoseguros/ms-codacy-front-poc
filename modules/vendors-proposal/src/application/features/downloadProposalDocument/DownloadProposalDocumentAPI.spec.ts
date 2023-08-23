import { AxiosHttpClient } from '@infrastructure/http-client';
import DownloadProposalDocumentAPI from './DownloadProposalDocumentAPI';

describe('DownloadProposalDocumentAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProposalDocument should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return { message: 'ok' };
      });
    const proposalId = 12345;
    const result = await DownloadProposalDocumentAPI.getProposalDocument(proposalId);
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
