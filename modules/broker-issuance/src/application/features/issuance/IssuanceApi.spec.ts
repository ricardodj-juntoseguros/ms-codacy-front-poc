import { AxiosHttpClient } from "@infrastructure/http-client";
import IssuanceApi from "./IssuanceApi";

describe('IssuanceApi', () => {
  it('postIssuance should call bff service correctly', async () => {
    const mockResult = {
      issued: true,
      issuedAt: new Date().toISOString(),
    }
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => mockResult);
    const result = await IssuanceApi.postIssuance(12345);
    expect(mockPost).toHaveBeenCalledWith({ url: "/v1/issuances/12345" });
    expect(result).toEqual(mockResult);
  });
});
