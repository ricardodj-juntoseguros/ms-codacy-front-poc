import { IHttpClient, IHttpClientRequestParameters } from "@infrastructure/http-client";
import BrokerInssuanceBaseApi from "../BrokerIssuanceBaseApi";
import { InsuredSearchDTO } from "../../types/dto";

class InsuredSelectionApi {
  private readonly httpClient: IHttpClient;

  public constructor() {
    this.httpClient = new BrokerInssuanceBaseApi().getInstance();
  }

  searchInsured = async (search: string) => {
    const params: IHttpClientRequestParameters = {
      url: `/v1/insureds/search?query=${search}`,
    };
    return this.httpClient.get<InsuredSearchDTO>(params);
  };
}

export default new InsuredSelectionApi();
