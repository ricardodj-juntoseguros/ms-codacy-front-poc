import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import FidelizeImportMapeamentosBaseApi from '../FidelizeMapeamentosImportBaseApi';
import { UploadProcessIdDTO } from '../../types/dto';

class ImportMappingApi {
  private instance: AxiosHttpClient;

  private docsInstance: AxiosHttpClient;

  public constructor() {
    this.instance = new FidelizeImportMapeamentosBaseApi().getInstance();
    this.docsInstance =
      new FidelizeImportMapeamentosBaseApi().getDocsInstance();
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
      url: 'files',
      headers: { 'Content-Type': 'multipart/form-data' },
      payload: data,
    };

    return await this.docsInstance.post(params);
  }

  async finalizeUploadProcess(id: number): Promise<any> {
    const params: IHttpClientRequestParameters = {
      url: `/backoffice/process/${id}/send-request`,
    };

    return await this.instance.post(params);
  }
}

export default ImportMappingApi;
