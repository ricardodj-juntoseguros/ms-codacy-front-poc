import {
  AxiosHttpClient,
  IHttpClientRequestParameters,
} from '@infrastructure/http-client';
import BrokerSignupBaseApi from '../BrokerSignupBaseApi';


class BrokerUploadDocumentApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerSignupBaseApi().getInstance();
  }

  async sendUploadFile(folder: string,path: string, file: File): Promise<any> {

    const data = new FormData();
    data.append('archive', folder);
    data.append('fileType', file.type);
    data.append('file', file, file.name);

    const params: IHttpClientRequestParameters = {
      url:`/signup/broker/upload/documents/userId=${path}`,
      headers: { 'Content-Type': 'multipart/form-data' },
      payload: data,
    };

    return await this.instance.post(params);
  }
}

const brokerUploadDocumentApi = new BrokerUploadDocumentApi();
export default brokerUploadDocumentApi;
