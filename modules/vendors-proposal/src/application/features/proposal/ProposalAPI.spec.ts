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
    const mockPost = jest
      .spyOn(AxiosHttpClient.prototype, 'post')
      .mockImplementation(async () => {
        return { message: 'ok' };
      });
    const result = await ProposalAPI.createProposal(proposalMock);
    expect(mockPost).toHaveBeenCalledWith({
      url: '/api/v1/proposal',
      payload: proposalMock,
    });
    expect(result).toEqual({ message: 'ok' });
  });

  it('updateProposal should call bff service correctly', async () => {
    const mockPut = jest
      .spyOn(AxiosHttpClient.prototype, 'put')
      .mockImplementation(async () => {
        return { message: 'ok' };
      });
    const result = await ProposalAPI.updateProposal(123, proposalMock);
    expect(mockPut).toHaveBeenCalledWith({
      url: '/api/v1/proposal/123',
      payload: proposalMock,
    });
    expect(result).toEqual({ message: 'ok' });
  });

  it('updateProposalToAnalysis should call bff service correctly', async () => {
    const mockPut = jest
      .spyOn(AxiosHttpClient.prototype, 'put')
      .mockImplementation(async () => {
        return { proposalId: 123, status: 2 };
      });
    const result = await ProposalAPI.updateProposalToAnalysis(123);
    expect(mockPut).toHaveBeenCalledWith({
      url: '/api/v1/proposal/123/send-analysis',
    });
    expect(result.proposalId).toEqual(123);
    expect(result.status).toEqual(2);
  });
});
