import { AxiosHttpClient } from '@infrastructure/http-client';
import { proposalMock, proposalResumeMock } from '../../../__mocks__';
import ProposalApi from './ProposalApi';

describe('ProposalApi', () => {
  it('putProposal should call bff service correctly', async () => {
    const mockResult = {
      ProposalId: 12345,
      PolicyId: 11111,
      QuotationId: 12223,
      NewQuoterId: 123333,
    };
    const mockPut = jest
      .spyOn(AxiosHttpClient.prototype, 'put')
      .mockImplementation(async () => {
        return mockResult;
      });
    const result = await ProposalApi.putProposal(12345, proposalMock);
    expect(mockPut).toHaveBeenCalledWith({
      url: '/v1/proposals/12345',
      payload: proposalMock,
    });
    expect(result).toEqual(mockResult);
  });

  it('getProposalResume should call bff service correclty', async () => {
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => {
        return proposalResumeMock;
      });
    const result = await ProposalApi.getProposalResume(12345);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/proposals/12345/details',
      params: {
        format: 'resume',
      },
    });
    expect(result).toEqual(proposalResumeMock);
  });

  it('getProposalDraft should call bff service correclty', async () => {
    const mockResult = { draftLink: 'draftLink' };
    const mockGet = jest
      .spyOn(AxiosHttpClient.prototype, 'get')
      .mockImplementation(async () => mockResult);
    const result = await ProposalApi.getProposalDraft(12345);
    expect(mockGet).toHaveBeenCalledWith({
      url: '/v1/proposals/12345/draft',
    });
    expect(result).toEqual(mockResult);
  });
});
