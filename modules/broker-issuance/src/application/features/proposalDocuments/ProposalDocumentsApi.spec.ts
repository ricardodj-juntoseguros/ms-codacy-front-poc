import { AxiosHttpClient } from "@infrastructure/http-client";
import ProposalDocumentsApi from "./ProposalDocumentsApi";

describe('ProposalDocumentsApi', () => {
  it('getProposalDocuments should call bff service correctly', async () => {
    const mockResult = [{
      size: 12321312321,
      url: 'url',
      extension: 'pdf',
      filename: 'test',
      metadata: null,
    }];
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => mockResult);
    const result = await ProposalDocumentsApi.getProposalDocuments(12345);
    expect(mockGet).toHaveBeenCalledWith({ url: '/v1/proposals/12345/documents' });
    expect(result).toEqual(mockResult);
  });

  it('postProposalDocument should call bff service correctly', async () => {
    const mockResult = [{
      size: 12321312321,
      url: 'url',
      extension: 'pdf',
      filename: 'test',
      metadata: null,
    }];
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => mockResult);
    const result = await ProposalDocumentsApi.postProposalDocument(12345, 1, new FormData());
    expect(mockPost).toHaveBeenCalledWith({
      url: '/v1/proposals/12345/documents',
      params: { userType: 1 },
      headers: { 'Content-Type': 'multipart/form-data' },
      payload: new FormData(),
    });
    expect(result).toEqual(mockResult);
  });

  it('deleteProposalDocument should call bff service correctly', async () => {
    const mockDelete = jest
      .spyOn(AxiosHttpClient.prototype, 'delete')
      .mockImplementation(async () => ({}));
    await ProposalDocumentsApi.deleteProposalDocument(12345, 'fieldname');
    expect(mockDelete).toHaveBeenCalledWith({ url: '/v1/proposals/12345/document/fieldname' });
  });

  it('getProposalDocuments should call bff service correctly', async () => {
    const mockResult = [{
      size: 12321312321,
      url: 'url',
      extension: 'pdf',
      filename: 'test',
      metadata: null,
    }];
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => mockResult);
    const result = await ProposalDocumentsApi.getProposalDocumentForDownload(12345);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/proposals/12345/document/download',
      headers: {
        Accept: 'application/pdf',
      },
      responseType: 'arraybuffer',
    });
    expect(result).toEqual(mockResult);
  });
});
