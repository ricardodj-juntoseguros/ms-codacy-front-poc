import { insuredMock, proposalMock } from '../../../__mocks__';
import { store } from '../../../config/store';
import ProposalAPI from './ProposalApi';
import { proposalActions, putProposal } from './ProposalSlice';

describe('ProposalSlice', () => {
  const mockResult = {
    ProposalId: 12345,
    PolicyId: 11111,
    QuotationId: 12223,
    NewQuoterId: 123333,
    createdAt: '2024-01-01T12:00:00.000Z',
  };

  beforeEach(() => {
    store.dispatch(proposalActions.clearProposal());
  });

  it('should be able to update a proposal', async () => {
    const putProposalMock = jest
      .spyOn(ProposalAPI, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { proposal } = store.getState();
    expect(putProposalMock).toHaveBeenCalled();
    expect(putProposalMock).toHaveBeenCalledWith(12345, proposalMock);
    expect(proposal.identification?.PolicyId).toEqual(mockResult.PolicyId);
    expect(proposal.createdAt).toBe('2024-01-01T12:00:00.000Z');
  });

  it('Should not update the store if the call returns an error', async () => {
    const putProposalMock = jest
      .spyOn(ProposalAPI, 'putProposal')
      .mockImplementation(() => Promise.reject(new Error('Not found')));
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
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

  it('should be able to set comments', async () => {
    store.dispatch(proposalActions.setComments('comments'));
    const { proposal } = store.getState();
    expect(proposal.comments).toEqual('comments');
  });

  it('should be able to set payment type', async () => {
    store.dispatch(proposalActions.setPaymentType({ label: 'label', value: 'value' }));
    const { proposal } = store.getState();
    expect(proposal.paymentType).toEqual({ label: 'label', value: 'value' });
  });

  it('should be able to set first due date', async () => {
    store.dispatch(proposalActions.setFirstDueDate('2024-01-01'));
    const { proposal } = store.getState();
    expect(proposal.firstDueDate).toEqual('2024-01-01');
  });

  it('should be able to set number of installments', async () => {
    store.dispatch(proposalActions.setNumberOfInstallments({ label: 'label', value: 'value' }));
    const { proposal } = store.getState();
    expect(proposal.numberOfInstallments).toEqual({ label: 'label', value: 'value' });
  });

  it('should be able to set is automatic policy', async () => {
    store.dispatch(proposalActions.setIsAutomaticPolicy(true));
    const { proposal } = store.getState();
    expect(proposal.isAutomaticPolicy).toEqual(true);
  });

  it('should be able to set has only financial pending', async () => {
    store.dispatch(proposalActions.setHasOnlyFinancialPending(true));
    const { proposal } = store.getState();
    expect(proposal.hasOnlyFinancialPending).toEqual(true);
  });

  it('should be able to set has proposal changes', async () => {
    store.dispatch(proposalActions.setHasProposalChanges(true));
    const { proposal } = store.getState();
    expect(proposal.hasProposalChanges).toEqual(true);
  });

  it('should be able to set current proposal', async () => {
    store.dispatch(proposalActions.setCurrentProposal(proposalMock));
    const { proposal } = store.getState();
    expect(proposal.currentProposal).toEqual(proposalMock);
  });

  it('should be able to set issued at', async () => {
    store.dispatch(proposalActions.setIssuedAt('2024-01-01'));
    const { proposal } = store.getState();
    expect(proposal.issuedAt).toEqual('2024-01-01');
  });
});
