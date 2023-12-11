import { insuredMock, proposalMock } from "../../../__mocks__";
import { store } from "../../../config/store";
import ProposalAPI from "./ProposalApi";
import { proposalActions, putProposal } from "./ProposalSlice";

describe('ProposalSlice', () => {
  const mockResult = {
    ProposalId: 12345,
    PolicyId: 11111,
    QuotationId: 12223,
    NewQuoterId: 123333,
  };

  beforeEach(() => {
    store.dispatch(proposalActions.clearProposal());
  });

  it('should be able to update a proposal', async () => {
    const putProposalMock = jest
      .spyOn(ProposalAPI, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    await store.dispatch(putProposal({ proposalId: 12345, proposalData: proposalMock }));
    const { proposal } = store.getState();
    expect(putProposalMock).toHaveBeenCalled();
    expect(putProposalMock).toHaveBeenCalledWith(12345, proposalMock);
    expect(proposal.identification?.policyId).toEqual(mockResult.PolicyId);
  });

  it('Should not update the store if the call returns an error', async () => {
    const putProposalMock = jest
      .spyOn(ProposalAPI, 'putProposal')
      .mockImplementation(() => Promise.reject(new Error('Not found')));
    await store.dispatch(putProposal({ proposalId: 12345, proposalData: proposalMock }));
    const { proposal } = store.getState();
    expect(putProposalMock).toHaveBeenCalled();
    expect(putProposalMock).toHaveBeenCalledWith(12345, proposalMock);
    expect(proposal.identification).toEqual(null);
  });

  it('should be able to set insured', async () => {
    store.dispatch(proposalActions.setInsured(insuredMock));
    const { proposal } = store.getState();
    expect(proposal.insured).toEqual(insuredMock);
  });

  it('should be able to set insured address', async () => {
    store.dispatch(proposalActions.setInsuredAddress(insuredMock.addresses[0]));
    const { proposal } = store.getState();
    expect(proposal.insuredAddress).toEqual(insuredMock.addresses[0]);
  });

  it('should be able to set bidding number', async () => {
    store.dispatch(proposalActions.setBiddingNumber('123456'));
    const { proposal } = store.getState();
    expect(proposal.biddingNumber).toEqual('123456');
  });

  it('should be able to set bidding description', async () => {
    store.dispatch(proposalActions.setBiddingDescription('Teste'));
    const { proposal } = store.getState();
    expect(proposal.biddingDescription).toEqual('Teste');
  });

  it('should be able to set create proposal success', async () => {
    store.dispatch(proposalActions.setCreateProposalSuccess(true));
    const { proposal } = store.getState();
    expect(proposal.createProposalSuccess).toEqual(true);
  });
});
