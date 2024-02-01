import { AxiosHttpClient } from "@infrastructure/http-client";
import CommercialAuthorizationApi from "./CommercialAuthorizationApi";

describe('CommercialAuthroization', () => {

  it('postCommercialAuthorizationLetter should call bff service correctly', async () => {
    const mockResult = {
      size: 12321312321,
      url: 'url',
      extension: 'pdf',
      filename: 'test',
      metadata: null,
    };

    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => mockResult);
    const result = await CommercialAuthorizationApi.postCommercialAuthorizationLetter(12345, new FormData());
    expect(mockPost).toHaveBeenCalledWith({
      url: '/v1/proposals/12345/document/commercial-authorization-letter',
      headers: { 'Content-Type': 'multipart/form-data' },
      payload: new FormData(),
    });
    expect(result).toEqual(mockResult);
  });
});