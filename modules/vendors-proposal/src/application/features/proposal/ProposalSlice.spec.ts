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

  it('should set insured values correctly', async () => {
    await store.dispatch(
      proposalActions.setInsuredValues({
        federalId: '11223344556677',
        name: 'Teste Segurado',
      }),
    );
    const { proposal } = store.getState();
    expect(proposal.insuredFederalId).toEqual('11223344556677');
    expect(proposal.insuredName).toEqual('Teste Segurado');
    expect(proposal.insuredAddressId).toEqual(0);
  });

  it('should set the insured address id value correctly', async () => {
    await store.dispatch(proposalActions.setInsuredAddressId(12345));
    const { proposal } = store.getState();
    expect(proposal.insuredAddressId).toEqual(12345);
  });

  it('should set the policyholder object correctly', async () => {
    const mockPolicyholder = {
      externalId: 123,
      federalId: '07184122000124',
      corporateName: 'Teste Tomador Mock',
    };
    await store.dispatch(proposalActions.setPolicyholder(mockPolicyholder));
    const { proposal } = store.getState();
    expect(proposal.policyholder).toStrictEqual(mockPolicyholder);
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
