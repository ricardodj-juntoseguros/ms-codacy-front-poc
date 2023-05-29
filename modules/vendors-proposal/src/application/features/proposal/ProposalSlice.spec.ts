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

  it('should set the hasProject value correctly', async () => {
    await store.dispatch(proposalActions.setHasProject(true));
    const { proposal } = store.getState();

    expect(proposal.hasProject).toEqual(true);
  });

  it('should set the project value correctly', async () => {
    const valueMock = {
      id: 1,
      name: 'Lorem',
      label: 'Lorem',
      value: '1',
    };
    await store.dispatch(proposalActions.setProject(valueMock));
    const { proposal } = store.getState();

    expect(proposal.project).toEqual(valueMock);
  });

  it('should set the policyholder contact correctly', async () => {
    const contact = {
      id: 1,
      name: 'John Doe',
      email: 'john@doe.com',
    };
    await store.dispatch(proposalActions.setPolicyholderContact(contact));
    const { proposal } = store.getState();

    expect(proposal.policyholderContact).toEqual(contact);
  });
});
