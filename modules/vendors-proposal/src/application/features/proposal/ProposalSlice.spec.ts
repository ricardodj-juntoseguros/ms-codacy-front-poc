/* eslint-disable no-var */
/* eslint-disable prefer-promise-reject-errors */
import { add, format, formatISO } from 'date-fns';
import { modalityListMock, proposalMock } from '../../../__mocks__';
import { store } from '../../../config/store';
import {
  createProposal,
  proposalActions,
  updateProposal,
} from './ProposalSlice';
import ProposalAPI from './ProposalAPI';

describe('ProposalSlice', () => {
  it('should set the contract number correctly', async () => {
    await store.dispatch(proposalActions.setContractNumber('12345'));
    const { proposal } = store.getState();

    expect(proposal.contractNumber).toEqual('12345');
  });

  it('should set the contract value correctly', async () => {
    await store.dispatch(proposalActions.setWarrantyPercentage(100));
    await store.dispatch(proposalActions.setContractValue(12345));
    const { proposal } = store.getState();

    expect(proposal.contractValue).toEqual(12345);
    expect(proposal.totalValue).toEqual(12345);
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
      id: '1',
      name: 'John Doe',
      email: 'john@doe.com',
    };
    await store.dispatch(proposalActions.setPolicyholderContact(contact));
    const { proposal } = store.getState();

    expect(proposal.policyholderContact).toEqual(contact);
  });

  it('should set the policyholder contact correctly', async () => {
    const contact = {
      id: '1',
      name: 'John Doe',
      email: 'john@doe.com',
    };
    await store.dispatch(proposalActions.setPolicyholderContact(contact));
    const { proposal } = store.getState();

    expect(proposal.policyholderContact).toEqual(contact);
  });

  it('should set the initial validity correctly', async () => {
    const date = {
      value: format(new Date(), 'dd/MM/yyyy'),
      isValid: true,
    };
    await store.dispatch(proposalActions.setInitialValidity(date));
    const { proposal } = store.getState();

    expect(proposal.initialValidity).toEqual(date.value);
  });

  it('should set the end validity correctly', async () => {
    const date = {
      value: format(add(new Date(), { days: 180 }), 'dd/MM/yyyy'),
      isValid: true,
    };
    await store.dispatch(proposalActions.setEndValidity(date));
    const { proposal } = store.getState();

    expect(proposal.endValidity).toEqual(date.value);
    expect(proposal.validityInDays).toEqual(180);
  });

  it('should set the validity in days correctly', async () => {
    await store.dispatch(proposalActions.setValidityInDays(360));
    const { proposal } = store.getState();

    expect(proposal.validityInDays).toEqual(360);
    expect(proposal.endValidity).toEqual(
      format(add(new Date(), { days: 360 }), 'dd/MM/yyyy'),
    );
  });

  it('should set the warranty percentage correctly', async () => {
    await store.dispatch(proposalActions.setWarrantyPercentage(80));
    const { proposal } = store.getState();

    expect(proposal.warrantyPercentage).toEqual(80);
  });

  it('should set the modality correctly', async () => {
    const modalityMock = {
      ...modalityListMock[0],
      label: modalityListMock[0].externalDescription,
      value: modalityListMock[0].modalityId.toString(),
    };

    await store.dispatch(proposalActions.setModality(modalityMock));
    const { proposal } = store.getState();

    expect(proposal.modality).toEqual(modalityMock);
  });

  it('should set the additional coverage labor correctly', async () => {
    await store.dispatch(proposalActions.setAdditionalCoverageLabor(true));
    const { proposal } = store.getState();

    expect(proposal.additionalCoverageLabor).toEqual(true);
  });

  it('should set the create proposal success correctly', async () => {
    await store.dispatch(proposalActions.setCreateProposalSuccess(true));
    const { proposal } = store.getState();

    expect(proposal.createProposalSuccess).toEqual(true);
  });

  it('should call the create proposal correctly', async () => {
    const createProposalAPIMock = jest
      .spyOn(ProposalAPI, 'createProposal')
      .mockImplementation(() =>
        Promise.resolve({
          ProposalId: 12345,
          PolicyId: 12345,
          NewQuoterId: 12345,
          QuotationId: 12345,
          createdAt: formatISO(new Date())
        }),
      );

    await store.dispatch(createProposal(proposalMock));
    const { proposal } = store.getState();

    expect(createProposalAPIMock).toHaveBeenCalledWith(proposalMock);
    expect(proposal.identification?.proposalId).toEqual(12345);
    expect(proposal.identification?.policyId).toEqual(12345);
  });

  it('should call the create proposal correctly and return error', async () => {
    const createProposalAPIMock = jest
      .spyOn(ProposalAPI, 'createProposal')
      .mockImplementation(() =>
        Promise.reject({ data: { data: { message: 'error' } } }),
      );

    await store.dispatch(createProposal(proposalMock));
    const { proposal } = store.getState();

    expect(createProposalAPIMock).toHaveBeenCalledWith(proposalMock);
    expect(proposal.createProposalLoading).toEqual(false);
    expect(proposal.createProposalSuccess).toEqual(false);
  });

  it('should call the create proposal correctly', async () => {
    const createProposalAPIMock = jest
      .spyOn(ProposalAPI, 'updateProposal')
      .mockImplementation(() =>
        Promise.resolve({
          ProposalId: 12,
          PolicyId: 123,
          NewQuoterId: 1234,
          QuotationId: 12345,
          createdAt: formatISO(new Date())
        }),
      );

    await store.dispatch(
      updateProposal({
        proposalId: 12,
        payload: proposalMock,
      }),
    );
    const { proposal } = store.getState();

    expect(createProposalAPIMock).toHaveBeenCalledWith(12, proposalMock);
    expect(proposal.identification?.proposalId).toEqual(12);
    expect(proposal.identification?.policyId).toEqual(123);
    expect(proposal.identification?.newQuoterId).toEqual(1234);
    expect(proposal.identification?.quotationId).toEqual(12345);
  });

  it('should call the create proposal correctly and return error', async () => {
    const updateProposalAPIMock = jest
      .spyOn(ProposalAPI, 'updateProposal')
      .mockImplementation(() =>
        Promise.reject({ data: { data: { message: 'error' } } }),
      );

    await store.dispatch(
      updateProposal({
        proposalId: 12,
        payload: proposalMock,
      }),
    );
    const { proposal } = store.getState();

    expect(updateProposalAPIMock).toHaveBeenCalledWith(12, proposalMock);
    expect(proposal.createProposalLoading).toEqual(false);
    expect(proposal.createProposalSuccess).toEqual(false);
  });
});
