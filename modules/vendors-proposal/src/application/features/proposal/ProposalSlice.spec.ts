import { store } from '../../../config/store';
import { proposalActions } from './ProposalSlice';

describe('ProposalSlice', () => {
  it('should set the contract number correctly', async () => {
    await store.dispatch(proposalActions.setContractNumber('12345'));
    const { proposal } = store.getState();

    expect(proposal.contractNumber).toEqual('12345');
  });

  it('should set the contract value correctly', async () => {
    await store.dispatch(proposalActions.setContractValue(12345));
    const { proposal } = store.getState();

    expect(proposal.contractValue).toEqual(12345);
  });
});
