import { AxiosHttpClient, IHttpClientRequestParameters } from "@infrastructure/http-client";
import BrokerInssuanceBaseApi from "../BrokerIssuanceBaseApi";
import { ObjectPreviewDTO, ObjectPreviewResultDTO } from "../../types/dto";

class ObjectPreviewApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerInssuanceBaseApi().getInstance();
  }

  async getObjectPreview(payload: ObjectPreviewDTO): Promise<ObjectPreviewResultDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/v1/insurance-objects/preview',
      payload,
    };
    return this.instance.post(params);
  }
}

export default new ObjectPreviewApi();
