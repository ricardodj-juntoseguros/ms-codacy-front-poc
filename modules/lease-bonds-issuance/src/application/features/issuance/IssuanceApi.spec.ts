import { AxiosHttpClient } from "@infrastructure/http-client";
import IssuanceApi from "./IssuanceApi";

describe('IssuanceApi', () => {
  it('postIssuance should call bff service correctly', async () => {
    const mockPayload = {
      isAutomatic: true,
      additionalInfo: '',
      internalizedReason: '',
      createdByEmployeeId: 0,
      contacts: [],
      comments: '',
      approvalContacts: [],
      acceptTermsId: null,
    }
    const mockResult = {
      issued: true,
      issuedAt: new Date().toISOString(),
    }
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => mockResult);
    const result = await IssuanceApi.postIssuance(12345, mockPayload);
    expect(mockPost).toHaveBeenCalledWith({ url: "/v1/issuances/12345", payload: mockPayload });
    expect(result).toEqual(mockResult);
  });
});
