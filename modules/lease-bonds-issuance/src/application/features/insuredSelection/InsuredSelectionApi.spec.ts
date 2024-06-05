import { AxiosHttpClient } from '@infrastructure/http-client';
import {
  insuredMock,
  newInsuredAddressMock,
  searchAddressMock,
} from '../../../__mocks__';
import InsuredSelectionApi from './InsuredSelectionApi';

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

  it('getAddressByZipcode should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return searchAddressMock;
      });
    const result = await InsuredSelectionApi.getAddressByZipcode('80410201');
    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/insureds/address/80410201',
    });
    expect(result).toStrictEqual(searchAddressMock);
  });

  it('saveInsuredAddress should call bff service correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return newInsuredAddressMock;
      });
    const result = await InsuredSelectionApi.saveInsuredAddress(
      125192,
      'Curitiba',
      'PR',
      'Rua Teste Cadastro, Centro',
    );
    expect(mockPost).toHaveBeenCalledWith({
      url: '/v1/insureds/address',
      payload: {
        insuredId: 125192,
        city: 'Curitiba',
        uf: 'PR',
        address: 'Rua Teste Cadastro, Centro',
      },
    });
    expect(result).toStrictEqual(newInsuredAddressMock);
  });
});
