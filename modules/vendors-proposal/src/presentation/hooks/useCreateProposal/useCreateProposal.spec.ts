/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';
import { format } from 'date-fns';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';
import { storeMock, policyholdersMock } from '../../../__mocks__';
import { useCreateProposal } from './useCreateProposal';

const mockValidate = jest.fn(
  () => new Promise((resolve, reject) => resolve(true)),
);

jest.mock('../useValidate', () => {
  const rest = jest.requireActual('../useValidate');
  return {
    ...rest,
    useValidate: () => mockValidate,
  };
});

describe('useCreateProposal', () => {
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  let InsuredAndPolicyholderSelectionApiMock: any = null;
  const updatedStoreMock = {
    ...storeMock,
    proposal: {
      ...storeMock.proposal,
      identification: null,
      createProposalLoading: false,
      contractNumber: '1234',
      contractValue: 1000,
      insuredName: 'Lorem',
      insuredFederalId: '91833813000118',
      insuredAddressId: 21,
      policyholder: {
        externalPolicyholderId: 1,
        federalId: '33768864000107',
        corporateName: 'TOMADOR 1',
      },
      hasProject: true,
      project: null,
      policyholderContact: {
        id: 1,
        name: 'Jonh Doe',
        email: 'jonh@doe.com',
      },
      initialValidity: format(new Date(), 'dd/MM/yyyy'),
      endValidity: '',
      validityInDays: 360,
      warrantyPercentage: 100,
      modality: {
        modalityId: 96,
        externalDescription: 'Executante construtor',
        allowsAdditionalCoverageLabor: true,
        submodalities: [
          {
            subModalityId: 1,
            externalDescription: 'Convencional',
            additionalCoverage: false,
          },
          {
            submodalityId: 26,
            externalDescription: 'Trabalhista e Previdenciária',
            additionalCoverage: true,
          },
        ],
        label: 'Executante construtor',
        value: '96',
      },
      additionalCoverageLabor: true,
    },
  };

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();

    InsuredAndPolicyholderSelectionApiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getPolicyholders')
      .mockImplementation(async () => Promise.resolve(policyholdersMock));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate correctly create a proposal', async () => {
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { result } = renderHook(() => useCreateProposal());
    const createProposalResult = await result.current();

    expect(createProposalResult).toEqual({ success: true, errors: {} });
    expect(InsuredAndPolicyholderSelectionApiMock).toHaveBeenCalledWith(
      '33768864000107',
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setPolicyholder(policyholdersMock[0]),
    );
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('should validate correctly update a proposal', async () => {
    const mock = {
      ...updatedStoreMock,
      proposal: {
        ...updatedStoreMock.proposal,
        identification: {
          proposalId: 123,
          policyId: 1234,
          quotationId: 12345,
          newQuoterId: 123456,
        },
      },
    };
    useSelectorMock.mockImplementation(select => select({ ...mock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { result } = renderHook(() => useCreateProposal());
    const createProposalResult = await result.current();

    expect(createProposalResult).toEqual({ success: true, errors: {} });
    expect(InsuredAndPolicyholderSelectionApiMock).toHaveBeenCalledWith(
      '33768864000107',
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setPolicyholder(policyholdersMock[0]),
    );
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('should return error and not continue the process if there is a failure when looking for the policyholder', async () => {
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);

    InsuredAndPolicyholderSelectionApiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getPolicyholders')
      .mockImplementation(async () =>
        Promise.reject({
          data: {
            data: [
              { message: 'Ops, houve um problema ao cadastrar o fornecedor.' },
            ],
          },
        }),
      );

    const { result } = renderHook(() => useCreateProposal());
    const createProposalResult = await result.current();

    expect(createProposalResult).toEqual({
      success: false,
      errors: {
        policyholderInputValue: [
          'Ops, houve um problema ao cadastrar o fornecedor.',
        ],
      },
    });
    expect(InsuredAndPolicyholderSelectionApiMock).toHaveBeenCalledWith(
      '33768864000107',
    );
    expect(mockDispatch).not.toHaveBeenCalledWith(
      proposalActions.setPolicyholder(policyholdersMock[0]),
    );
  });
});
