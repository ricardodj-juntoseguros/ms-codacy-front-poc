import { AxiosHttpClient } from '@infrastructure/http-client';
import { modalityListMock } from 'modules/vendors-proposal/src/__mocks__';
import ModalitySelectionAPI from './ModalitySelectionAPI';

describe('ModalitySelectionAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getModalities should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return modalityListMock;
      });
    const result = await ModalitySelectionAPI.getModalities('91833813000118');
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/products',
      params: {
        insuredFederalId: '91833813000118',
      },
    });
    expect(result).toEqual(modalityListMock);
  });
});
