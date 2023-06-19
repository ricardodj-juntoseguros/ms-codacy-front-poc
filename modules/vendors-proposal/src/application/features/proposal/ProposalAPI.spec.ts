import { AxiosHttpClient } from '@infrastructure/http-client';
import { proposalMock } from '../../../__mocks__';
import ProposalAPI from './ProposalAPI';

describe('ProposalAPI', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_VENDORS_BFF_URL = 'any_url';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createProposal should call bff service correctly', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { message: 'ok' };
      });
    const result = await ProposalAPI.createProposal(proposalMock);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/api/v1/proposal',
      payload: proposalMock,
    });
    expect(result).toEqual({ message: 'ok' });
  });
});
