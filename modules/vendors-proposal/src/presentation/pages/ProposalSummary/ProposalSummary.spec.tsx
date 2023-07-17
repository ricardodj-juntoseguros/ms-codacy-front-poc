/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { add, format } from 'date-fns';
import { nanoid } from '@reduxjs/toolkit';
import ProjectSelectionAPI from '../../../application/features/projectSelection/ProjectSelectionAPI';
import PolicyholderContactAPI from '../../../application/features/policyholderContact/PolicyholderContactAPI';
import IssuanceAPI from '../../../application/features/Issuance/IssuanceAPI';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import { act, fireEvent, render } from '../../../config/testUtils';
import ProposalSummary from './ProposalSummary';
import {
  modalityListMock,
  policyholdersMock,
  storeMock,
} from '../../../__mocks__';
import * as contextFile from '../../../config/filesContext';
import { UpdateProposalStatusDTO } from '../../../application/types/dto';
import ProposalAPI from '../../../application/features/proposal/ProposalAPI';

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => {
  const rest = jest.requireActual('react-router');

  return {
    ...rest,
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  };
});

describe('ProposalSummary', () => {
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const handleSetFilesMock = jest.fn();
  const deleteFileMock = jest.fn();
  let uploadDocumentsMock = jest.fn(() => true);
  const file = new File(['(⌐□_□)'], 'file.pdf', {
    type: 'application/pdf',
  });
  const updatedStoreMock = {
    ...storeMock,
    projectSelection: {
      projectSearchValue: 'lorem',
    },
    proposal: {
      ...storeMock.proposal,
      policyholder: policyholdersMock[0],
      identification: {
        proposalId: 12345,
        policyId: 12345,
      },
      policyholderContact: {
        id: '',
        name: 'John Doe',
        email: 'john@doe.com',
      },
      project: {
        id: 1,
        name: 'Lorem',
        value: '1',
        label: 'Lorem',
      },
      modality: modalityListMock[0],
      totalValue: 1000,
      additionalCoverageLabor: false,
      warrantyPercentage: 100,
      endValidity: format(add(new Date(), { days: 360 }), 'dd/MM/yyyy'),
      validityInDays: 360,
      insuredName: 'Lorem',
      contractNumber: '12345',
      contractValue: 1000,
    },
  };
  jest.spyOn(contextFile, 'useFiles').mockImplementation(() => ({
    files: [
      {
        id: nanoid(5),
        file,
        status: 'success',
      },
    ],
    handleSetFiles: handleSetFilesMock,
    deleteFile: deleteFileMock,
    uploadDocuments: uploadDocumentsMock,
  }));

  let updateProposalToAnalysisMock: jest.SpyInstance<
    Promise<UpdateProposalStatusDTO>,
    [proposalId: number]
  > | null = null;
  let linkProjectMock: jest.SpyInstance<
    Promise<void>,
    [
      projectSearchValue: string,
      projectId: string | null,
      policyId: number,
      insuredFederalId: string,
    ]
  > | null = null;
  let createContactMock: jest.SpyInstance<
    Promise<unknown>,
    [name: string, email: string, federalId: string]
  > | null = null;
  let IssuanceAPIMock: jest.SpyInstance<
    Promise<void>,
    [proposalId: number]
  > | null = null;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();

    uploadDocumentsMock = jest.fn(() => true);

    linkProjectMock = jest
      .spyOn(ProjectSelectionAPI, 'linkProject')
      .mockImplementation(() => Promise.resolve());
    createContactMock = jest
      .spyOn(PolicyholderContactAPI, 'createContact')
      .mockImplementation(() => Promise.resolve({ id: 1 }));
    IssuanceAPIMock = jest
      .spyOn(IssuanceAPI, 'submitToApproval')
      .mockImplementation(() => Promise.resolve());
    updateProposalToAnalysisMock = jest
      .spyOn(ProposalAPI, 'updateProposalToAnalysis')
      .mockImplementation(() =>
        Promise.resolve({ proposalId: 123, status: 2 }),
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', async () => {
    useSelectorMock.mockImplementation(select => select(updatedStoreMock));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { baseElement } = render(<ProposalSummary />);

    expect(baseElement).toBeInTheDocument();
  });

  it('should go to home if you can t a proposal id', async () => {
    const mock = {
      ...updatedStoreMock,
      proposal: {
        ...updatedStoreMock.proposal,
        identification: null,
      },
    };
    useSelectorMock.mockImplementation(select => select(mock));
    useDispatchMock.mockImplementation(() => mockDispatch);
    render(<ProposalSummary />);

    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should go back to proposal flow when user clicks edit button', async () => {
    useSelectorMock.mockImplementation(select => select(updatedStoreMock));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ProposalSummary />);

    const buttonEdit = getByTestId('proposalSummary-button-edit');
    await act(async () => {
      await fireEvent.click(buttonEdit);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setCreateProposalSuccess(false),
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });

  it('should follow the issuance flow if it had all the data', async () => {
    useSelectorMock.mockImplementation(select => select(updatedStoreMock));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ProposalSummary />);

    const buttonSubmit = getByTestId('proposalSummary-button-submit');
    await act(async () => {
      await fireEvent.click(buttonSubmit);
    });

    expect(linkProjectMock).toHaveBeenCalledWith('lorem', '1', 12345, '');
    expect(uploadDocumentsMock).toHaveBeenCalled();
    expect(createContactMock).toHaveBeenCalledWith(
      'John Doe',
      'john@doe.com',
      '33768864000107',
    );
    expect(IssuanceAPIMock).toHaveBeenCalledWith(12345);
    expect(updateProposalToAnalysisMock).toHaveBeenCalledWith(12345);
    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should not call the contact register if there is a contact id', async () => {
    const mock = {
      ...updatedStoreMock,
      proposal: {
        ...updatedStoreMock.proposal,
        policyholderContact: {
          ...updatedStoreMock.proposal.policyholderContact,
          id: '1',
        },
      },
    };
    useSelectorMock.mockImplementation(select => select(mock));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ProposalSummary />);

    const buttonSubmit = getByTestId('proposalSummary-button-submit');
    await act(async () => {
      await fireEvent.click(buttonSubmit);
    });

    expect(updateProposalToAnalysisMock).toHaveBeenCalledWith(12345);
    expect(linkProjectMock).toHaveBeenCalledWith('lorem', '1', 12345, '');
    expect(uploadDocumentsMock).toHaveBeenCalled();
    expect(createContactMock).not.toHaveBeenCalledWith(
      'John Doe',
      'john@doe.com',
      '33768864000107',
    );
    expect(IssuanceAPIMock).toHaveBeenCalledWith(12345);
    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should not continue the flow if the upload of documents presents an error', async () => {
    uploadDocumentsMock = jest.fn(() => false);
    useSelectorMock.mockImplementation(select => select(updatedStoreMock));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ProposalSummary />);

    const buttonSubmit = getByTestId('proposalSummary-button-submit');
    await act(async () => {
      await fireEvent.click(buttonSubmit);
    });

    expect(updateProposalToAnalysisMock).toHaveBeenCalledWith(12345);
    expect(linkProjectMock).toHaveBeenCalledWith('lorem', '1', 12345, '');
    expect(uploadDocumentsMock).toHaveBeenCalled();
    expect(createContactMock).not.toHaveBeenCalledWith(
      'John Doe',
      'john@doe.com',
      '33768864000107',
    );
    expect(IssuanceAPIMock).not.toHaveBeenCalledWith(12345);
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });

  it('should not continue the flow if the contact registration presents an error', async () => {
    createContactMock = jest
      .spyOn(PolicyholderContactAPI, 'createContact')
      .mockImplementation(() =>
        Promise.reject({ data: { data: [{ message: 'error' }] } }),
      );
    useSelectorMock.mockImplementation(select => select(updatedStoreMock));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ProposalSummary />);

    const buttonSubmit = getByTestId('proposalSummary-button-submit');
    await act(async () => {
      await fireEvent.click(buttonSubmit);
    });

    expect(updateProposalToAnalysisMock).toHaveBeenCalledWith(12345);
    expect(linkProjectMock).toHaveBeenCalledWith('lorem', '1', 12345, '');
    expect(uploadDocumentsMock).toHaveBeenCalled();
    expect(createContactMock).toHaveBeenCalledWith(
      'John Doe',
      'john@doe.com',
      '33768864000107',
    );
    expect(IssuanceAPIMock).not.toHaveBeenCalledWith(12345);
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });

  it('should remain on the proposal summary page in case the issue call returns an error', async () => {
    IssuanceAPIMock = jest
      .spyOn(IssuanceAPI, 'submitToApproval')
      .mockImplementation(() =>
        Promise.reject({ data: { data: [{ message: 'error' }] } }),
      );
    useSelectorMock.mockImplementation(select => select(updatedStoreMock));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ProposalSummary />);

    const buttonSubmit = getByTestId('proposalSummary-button-submit');
    await act(async () => {
      await fireEvent.click(buttonSubmit);
    });

    expect(updateProposalToAnalysisMock).toHaveBeenCalledWith(12345);
    expect(linkProjectMock).toHaveBeenCalledWith('lorem', '1', 12345, '');
    expect(uploadDocumentsMock).toHaveBeenCalled();
    expect(createContactMock).toHaveBeenCalledWith(
      'John Doe',
      'john@doe.com',
      '33768864000107',
    );
    expect(IssuanceAPIMock).toHaveBeenCalledWith(12345);
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });
});
