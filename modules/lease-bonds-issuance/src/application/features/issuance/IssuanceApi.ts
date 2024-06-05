import { AxiosHttpClient } from "@infrastructure/http-client";
import LeaseBondsIssuanceBaseApi from "../LeaseBondsIssuanceBaseApi";
import { SubmitToApprovalOrIssuanceDTO, SubmitToApprovalOrIssuanceResultDTO } from "../../types/dto";

class IssuanceApi {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new LeaseBondsIssuanceBaseApi().getInstance();
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
