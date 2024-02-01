import { AxiosHttpClient } from "@infrastructure/http-client";
import BrokerInssuanceBaseApi from "../BrokerIssuanceBaseApi";
import { SubmitToApprovalOrIssuanceDTO, SubmitToApprovalOrIssuanceResultDTO } from "../../types/dto";

class IssuanceApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new BrokerInssuanceBaseApi().getInstance();
  }

  async postIssuance(newQuoterId: number, payload: SubmitToApprovalOrIssuanceDTO): Promise<SubmitToApprovalOrIssuanceResultDTO> {
    const params = {
      url: `/v1/issuances/${newQuoterId}`,
      payload,
    };
    return this.instance.post<SubmitToApprovalOrIssuanceResultDTO>(params);
  }
}

export default new IssuanceApi();
