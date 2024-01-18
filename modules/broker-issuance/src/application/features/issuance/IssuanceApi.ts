import { AxiosHttpClient } from "@infrastructure/http-client";
import BrokerInssuanceBaseApi from "../BrokerIssuanceBaseApi";
import { IssuanceDTO } from "../../types/dto";

class IssuanceApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerInssuanceBaseApi().getInstance();
  }

  async postIssuance(newQuoterId: number, payload: any): Promise<IssuanceDTO> {
    const params = {
      url: `/v1/issuances/${newQuoterId}`,
      payload,
    };
    return this.instance.post<IssuanceDTO>(params);
  }
}

export default new IssuanceApi();
