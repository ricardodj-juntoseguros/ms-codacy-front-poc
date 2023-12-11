import { AxiosHttpClient } from "@infrastructure/http-client";
import { insuredMock } from "../../../__mocks__";
import InsuredSelectionApi from "./InsuredSelectionApi";

describe('InsuredSelectionApi', () => {
  it('searchInsured should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return insuredMock;
      });
    const result = await InsuredSelectionApi.searchInsured('prefeitura');
    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/insureds/search?query=prefeitura',
    });
    expect(result).toBe(insuredMock);
  });
});
