import { AxiosHttpClient } from '@infrastructure/http-client';
import BrokerUploadDocumentApi from './BrokerUploadDocumentApi';
import { FOLDERS_UPLOAD_DOCUMENTS } from '../../../constants/foldersUploadDocuments';

describe('BrokerUploadDocumentApi', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PLATFORM_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('BrokerUploadDocumentApi should call bff service correctly', async () => {
    const fileMock = new File([""], 'teste.png');
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return '';
      });

    await BrokerUploadDocumentApi.sendUploadFile(FOLDERS_UPLOAD_DOCUMENTS.contractSocial,'rIfhyixOEq',fileMock);

    expect(mockGet).toHaveBeenCalled();
  });
});
