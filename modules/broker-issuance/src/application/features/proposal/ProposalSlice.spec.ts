import { insuredMock, proposalMock } from '../../../__mocks__';
import { store } from '../../../config/store';
import CanAuthorizeApi from '../canAuthorize/CanAuthorizeApi';
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

  it('should be able to update a proposal and get issue authorize status', async () => {
    const putProposalMock = jest
      .spyOn(ProposalAPI, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    const canAuthorizeMock = jest
      .spyOn(CanAuthorizeApi, 'getCanAuthorize')
      .mockImplementation(() =>
        Promise.resolve({
          isAutomaticPolicy: true,
          issueMessage: '',
          hasOnlyFinancialPending: false,
        }),
      );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { proposal } = store.getState();
    expect(putProposalMock).toHaveBeenCalled();
    expect(putProposalMock).toHaveBeenCalledWith(12345, proposalMock);
    expect(canAuthorizeMock).toHaveBeenCalledWith(11111);
    expect(proposal.identification?.PolicyId).toEqual(mockResult.PolicyId);
    expect(proposal.createdAt).toBe('2024-01-01T12:00:00.000Z');
    expect(proposal.isAutomaticPolicy).toBe(true);
    expect(proposal.hasOnlyFinancialPending).toBe(false);
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
    expect(proposal.currentProposal).toEqual(null);
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
    store.dispatch(proposalActions.setPaymentType(1));
    const { proposal } = store.getState();
    expect(proposal.paymentType).toEqual(1);
  });

  it('should be able to set first due date', async () => {
    store.dispatch(proposalActions.setFirstDueDate('2024-01-01'));
    const { proposal } = store.getState();
    expect(proposal.firstDueDate).toEqual('2024-01-01');
  });

  it('should be able to set number of installments', async () => {
    store.dispatch(proposalActions.setNumberOfInstallments(2));
    const { proposal } = store.getState();
    expect(proposal.numberOfInstallments).toEqual(2);
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
});
