import { AxiosHttpClient } from "@infrastructure/http-client";
import { objectPreviewMock, objectPreviewResultMock } from "../../../__mocks__";
import ObjectPreviewApi from "./ObjectPreviewApi";

describe('ObjectPreviewApi', () => {
  it('should be able to get object preview', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return objectPreviewResultMock;
      });
    const result = await ObjectPreviewApi.getObjectPreview(objectPreviewMock);
    expect(mockPost).toHaveBeenCalledWith({ payload: objectPreviewMock, url: "/v1/insurance-objects/preview" });
    expect(result).toEqual(objectPreviewResultMock);
  });
});
