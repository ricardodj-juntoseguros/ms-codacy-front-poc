import { AxiosHttpClient } from '@infrastructure/http-client';
import UploadDocumentAPI from './UploadDocumentAPI';

describe('UploadDocumentAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploadDocument should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { message: 'ok' };
      });
    const file = new File(['(⌐□_□)'], 'file.pdf', {
      type: 'application/pdf',
    });
    const formData = new FormData();
    formData.append('files', file, file.name);

    const result = await UploadDocumentAPI.uploadDocument(1234, formData);

    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/document/proposal/1234',
      headers: { 'Content-Type': 'multipart/form-data' },
      payload: formData,
    });
    expect(result).toEqual({ message: 'ok' });
  });
});
