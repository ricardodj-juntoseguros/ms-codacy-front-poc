import { AxiosHttpClient } from '@infrastructure/http-client';
import IncentiveTrailApi from './IncentiveTrailApi';
import { incentiveTrailMock } from '../../../__mocks__';

describe('IncentiveTrailApi', () => {
  it('[getCampaignData] should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => incentiveTrailMock);
    const result = await IncentiveTrailApi.getCampaignData(1, '06465132135429');
    expect(mockGet).toHaveBeenCalledWith({
      url: 'ms-bonus-journey/producttion/calculate',
      params: {
        campaignId: 1,
        brokerFederalId: '06465132135429',
      },
    });
    expect(result).toEqual(incentiveTrailMock);
  });

  it('[postAcceptIncentiveTrail] should call bff service correctly', async () => {
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => Promise.resolve());
    await IncentiveTrailApi.postAcceptIncentiveTrail(1);
    expect(mockPost).toHaveBeenCalledWith({
      url: 'bonus_journey/send/accept/term',
      payload: {
        campaignId: 1,
      },
    });
  });
});
