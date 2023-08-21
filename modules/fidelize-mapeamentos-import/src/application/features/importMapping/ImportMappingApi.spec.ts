import { AxiosHttpClient } from '@infrastructure/http-client';
import ImportMappingApi from './ImportMappingApi';

describe('ImportMappingApi', () => {
  let file: File;
  beforeAll(() => {
    process.env.NX_GLOBAL_GATEWAY_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    file = new File(['(⌐□_□)'], 'sheet01.xls', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  });

  it('generateProcessId call backoffice process to get a new id correctly before upload', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { id: 123456 };
      });
    const result = await new ImportMappingApi().generateUploadProcessId();

    expect(mockPost).toHaveBeenCalledWith({
      url: '/backoffice/process',
      payload: { type: 4 },
    });
    expect(result.id).toEqual(123456);
  });

  it('sendUploadFile should call backoffice api documents to send id of process and file', async () => {
    const data = new FormData();
    data.append('file', file, file.name);
    data.append('QuoteId', '123456');

    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return Promise.resolve();
      });
    const result = await new ImportMappingApi().sendUploadFile(123456, file);

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith({
      url: 'files',
      headers: { 'Content-Type': 'multipart/form-data' },
      payload: data,
    });
    expect(result).not.toBe(null);
  });

  it('finalizeProcessId should call backoffice api process send request with process id to send email to user', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return Promise.resolve();
      });
    const result = await new ImportMappingApi().finalizeUploadProcess(123456);

    expect(mockPost).toHaveBeenCalledWith({
      url: '/backoffice/process/123456/send-request',
    });
    expect(result).not.toBe(null);
  });
});
