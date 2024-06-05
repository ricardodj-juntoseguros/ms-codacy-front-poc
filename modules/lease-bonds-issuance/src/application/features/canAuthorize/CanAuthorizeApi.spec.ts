import { AxiosHttpClient } from "@infrastructure/http-client";
import CanAuthorizeApi from "./CanAuthorizeApi";

describe('CanAuthorizeApi', () => {
  it('getCanAuthorize should call bff service correctly', async () => {
    const mockResult = {
      isAutomaticPolicy: true,
      issueMessage: '',
      hasOnlyFinancialPending: false,
    }
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => mockResult);
    const result = await CanAuthorizeApi.getCanAuthorize(12345);
    expect(mockGet).toHaveBeenCalledWith({ url: "/v1/proposals/12345/can-authorize" });
    expect(result).toEqual(mockResult);
  });
});
