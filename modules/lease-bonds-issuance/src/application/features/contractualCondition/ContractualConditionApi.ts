import { AxiosHttpClient, IHttpClientRequestParameters } from "@infrastructure/http-client";
import LeaseBondsIssuanceBaseApi from "../LeaseBondsIssuanceBaseApi";
import { CustomClauseRequestedByEnum } from "../../types/model";
import { CustomClauseDTO } from "../../types/dto";

class ContractualCondition {
  private instance: AxiosHttpClient;

  public constructor() {
    this.instance = new LeaseBondsIssuanceBaseApi().getInstance();
  }

  async getCustomClause(policyId: number): Promise<CustomClauseDTO[]> {
    const params: IHttpClientRequestParameters = {
      url: `/v1/clauses/custom`,
      params: { policyId },
    };
    return this.instance.get<CustomClauseDTO[]>(params);
  }

  async postCustomClause(policyId: number, requestedBy: CustomClauseRequestedByEnum, text: string): Promise<CustomClauseDTO> {
    const params: IHttpClientRequestParameters = {
      url: '/v1/clauses/custom',
      payload: { policyId, requestedBy, text },
    };
    return this.instance.post<CustomClauseDTO>(params);
  }

  async patchCustomClause(clauseId: number, isDelete: boolean, requestedBy: CustomClauseRequestedByEnum, text: string) {
    const params: IHttpClientRequestParameters = {
      url: `/v1/clauses/custom/${clauseId}`,
      payload: { delete: isDelete, requestedBy, text },
    };
    return this.instance.patch(params);
  }
}

export default new ContractualCondition();
