import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import FidelizeImportMapeamentosBaseApi from '../FidelizeMapeamentosImportBaseApi';
import { UploadProcessIdDTO } from '../../types/dto/UploadProcessIdDTO';

class ImportMappingApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeImportMapeamentosBaseApi().getInstance();
  }

  async generateUploadProcessId(): Promise<UploadProcessIdDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/backoffice/process',
      payload: { type: 4 },
    };

    return await this.instance.post(params);
  }

  async sendUploadFile(id: number, file: File): Promise<any> {
    const data = new FormData();
    data.append('file', file, file.name);
    data.append('QuoteId', `${id}`);

    const params: IHttpClientRequestParameters = {
      url: '/api_documents/files',
      headers: { 'Content-Type': 'multipart/form-data' },
      payload: data,
    };

    return await this.instance.post(params);
  }

  async finalizeUploadProcess(id: number): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/backoffice/process/${id}/send-request`,
    };

    return await this.instance.post(params);
  }
}

export default ImportMappingApi;
