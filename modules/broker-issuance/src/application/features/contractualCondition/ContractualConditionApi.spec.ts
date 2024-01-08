import { AxiosHttpClient } from "@infrastructure/http-client";
import { customClauseMock } from "../../../__mocks__";
import ContractualConditionApi from "./ContractualConditionApi";

describe('ContractualConditionApi', () => {
  it('should be able to get custom contractual conditions', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return customClauseMock;
      });
    const result = await ContractualConditionApi.getCustomClause(12345);
    expect(mockGet).toHaveBeenCalledWith({ params: { policyId: 12345 }, url: "/v1/clauses/custom" });
    expect(result).toEqual(customClauseMock);
  });

  it('should be able to post custom contractual condition', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return customClauseMock[0];
      });
    const result = await ContractualConditionApi.postCustomClause(12345, 1, 'Teste');
    expect(mockPost).toHaveBeenCalledWith({ payload: { policyId: 12345, requestedBy: 1, text: "Teste" }, url: "/v1/clauses/custom" });
    expect(result).toEqual(customClauseMock[0]);
  });

  it('should be able to patch custom contractual condition', async () => {
    const mockPatch = jest
      .spyOn(AxiosHttpClient.prototype, 'patch')
      .mockImplementation(async () => {
        Promise.resolve();
      });
    await ContractualConditionApi.patchCustomClause(12345, true, 1, 'Teste');
    expect(mockPatch).toHaveBeenCalledWith({ payload: { delete: true, requestedBy: 1, text: "Teste" }, url: "/v1/clauses/custom/12345" });
  });
});
