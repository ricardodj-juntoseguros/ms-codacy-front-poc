import { AxiosHttpClient } from "@infrastructure/http-client";
import LeaseBondsIssuanceBaseApi from "../LeaseBondsIssuanceBaseApi";
import { CanAuthorizeDTO } from "../../types/dto";

class CanAuthorizeApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new LeaseBondsIssuanceBaseApi().getInstance();
  }

  async getCanAuthorize(policyId: number): Promise<CanAuthorizeDTO> {
    const params = {
      url: `/v1/proposals/${policyId}/can-authorize`,
    };
    return this.instance.get<CanAuthorizeDTO>(params);
  }
}

export default new CanAuthorizeApi();
