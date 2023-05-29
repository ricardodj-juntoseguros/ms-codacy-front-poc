import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import ProjectSelectionAPI from '../../../application/features/projectSelection/ProjectSelectionAPI';
import { projectSelectionActions } from '../../../application/features/projectSelection/ProjectSelectionSlice';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import ContractData from './ContractData';
import * as contextFile from '../../../config/filesContext';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import { storeMock } from '../../../__mocks__';

// eslint-disable-next-line prefer-promise-reject-errors
let mockValidate = jest.fn(() => (new Promise((resolve, reject) => resolve({
  errors: {},
  isValidForm: true,
  isValidating: false
}))));

jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useValidate: () => (mockValidate),
  };
});

describe('ContractData', () => {
  const handleNextStepMock = jest.fn();
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector')
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const handleSetFilesMock = jest.fn();
  const deleteFileMock = jest.fn();
  const file = new File(['(⌐□_□)'], 'file.pdf', {
    type: 'application/pdf',
  });
  jest.spyOn(contextFile, 'useFiles').mockImplementation(() => ({
    files: [{
      id: nanoid(5),
      file,
      status: 'success'
    }],
    handleSetFiles: handleSetFilesMock,
    deleteFile: deleteFileMock
  }));
  jest
  .spyOn(ProjectSelectionAPI, 'getProjects')
  .mockImplementation(() => Promise.resolve([
    {
      id: 1,
      name: 'Lorem',
    }
  ]));

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<ContractData handleNextStep={handleNextStepMock}/>);
    expect(baseElement).toBeTruthy();
  });

  it('should render button disabled when data has not been populated', () => {
    const { getByTestId } = render(<ContractData handleNextStep={handleNextStepMock}/>);

    const button = getByTestId('contractData-button-next');

    expect(button).toBeDisabled();
  });

  it('should allow the user to fill in the information in the form', async () => {
    const updatedStoreMock = {
      ...storeMock,
      proposal: {
        ...storeMock.proposal,
        hasProject: true
      },
      projectSelectionActions: {
        projectOptions: [],
        projectOptionsMapped: [],
        projectSearchValue: 'Lorem'
      }
    };
    useSelectorMock.mockImplementation(select => select({ ...updatedStoreMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ContractData handleNextStep={handleNextStepMock}/>);

    const contractNumberInput = getByTestId('contractData-input-contract-number');
    const contractValueInput = getByTestId('contractData-input-contract-value');
    const hasProjectToggle = getByTestId('contractData-toggle-has-project');
    const searchProjectInput = getByTestId('contract-data-input-project-name');
    const uploadFileInput = getByTestId('input-files');

    await act(async () => {
      await fireEvent.change(contractNumberInput, { target: { value: '12345' } });
    });
    expect(mockDispatch).toHaveBeenCalledWith(proposalActions.setContractNumber('12345'));

    await act(async () => {
      await fireEvent.change(contractValueInput, { target: { value: 12345 } });
    });
    expect(mockDispatch).toHaveBeenCalledWith(proposalActions.setContractValue(12345));

    await act(async () => {
      await fireEvent.click(hasProjectToggle);
    });
    expect(mockDispatch).toHaveBeenCalledWith(proposalActions.setHasProject(false));

    await act(async () => {
      await fireEvent.change(uploadFileInput, { target: { files: [file] } });
    });
    expect(handleSetFilesMock).toHaveBeenCalled();

    await act(async () => {
      await fireEvent.focus(searchProjectInput);
      await fireEvent.change(searchProjectInput, { target: { value: 'Lorem' } });
    });
    expect(mockDispatch).toHaveBeenCalledWith(projectSelectionActions.setProjectSearchValue('Lorem'));
  });

  it('should search for related projects and let user select the project', async () => {
    const updatedStoreMock = {
      ...storeMock,
      proposal: {
        ...storeMock.proposal,
        hasProject: true
      },
      projectSelectionActions: {
        projectOptions: [],
        projectOptionsMapped: [],
        projectSearchValue: 'Lorem'
      }
    };
    useSelectorMock.mockImplementation(select => select({ ...updatedStoreMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId, getByText } = render(<ContractData handleNextStep={handleNextStepMock}/>);

    const searchProjectInput = getByTestId('contract-data-input-project-name');

    await act(async () => {
      await fireEvent.focus(searchProjectInput);
      await fireEvent.change(searchProjectInput, { target: { value: 'Lorem' } });
    });
    expect(mockDispatch).toHaveBeenCalledWith(projectSelectionActions.setProjectSearchValue('Lorem'));
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2);
    });

    const projectItem = getByText('Lorem');
    await act(async () => {
      await fireEvent.click(projectItem);
    });
    expect(mockDispatch).toHaveBeenCalledWith(proposalActions.setProject({
      id: 1,
      name: 'Lorem',
      label: 'Lorem',
      value: '1',
    }));
  })

  it('should allow the user to continuation of the flow', async () => {
    const storeMockUpdated = {
      ...storeMock,
      proposal: {
        ...storeMock.proposal,
        contractNumber: '12345',
        contractValue: 12345,
        hasProject: false,
      },
    }
    useSelectorMock.mockImplementation(select => select({ ...storeMockUpdated }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ContractData handleNextStep={handleNextStepMock}/>);

    const button = getByTestId('contractData-button-next');
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(button).not.toBeDisabled();
    expect(handleNextStepMock).toHaveBeenCalledWith('12345 - R$ 12.345,00');
  });

  it('should allow the user to remove a file', async () => {
    const { getByTestId } = render(<ContractData handleNextStep={handleNextStepMock}/>);

    const button = getByTestId('remove-file');
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(deleteFileMock).toHaveBeenCalled();
  });

  it('should inform the user if any field is invalid and not proceed with the flow', async () => {
    const storeMockUpdated = {
      ...storeMock,
      proposal: {
        contractNumber: '12345',
        contractValue: 12345,
        hasProject: true,
        project: null
      },
    }
    mockValidate = jest.fn(() => (new Promise((resolve, reject) => resolve({
      errors: {
        contractNumber: ['O preenchimento deste campo é obrigatório'],
        contractValue: ['Valor menor que o mínimo permitido.'],
        project: ['O preenchimento deste campo é obrigatório'],
        files: ['Valor menor que o mínimo permitido.']
      },
      isValidForm: false,
      isValidating: false
    }))));
    useSelectorMock.mockImplementation(select => select({ ...storeMockUpdated }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId, queryByText, queryAllByText } = render(<ContractData handleNextStep={handleNextStepMock}/>);

    const button = getByTestId('contractData-button-next');
    await act(async () => {
      await fireEvent.click(button);
    });

    const requiredError = await queryAllByText('O preenchimento deste campo é obrigatório');
    const minError = await queryByText('Valor menor que o mínimo permitido.');

    expect(requiredError.length).toEqual(2);
    expect(minError).toBeInTheDocument();
    expect(handleNextStepMock).not.toHaveBeenCalled();
  });

  it('should be render tooltip', async() => {
    const storeMockUpdated = {
      ...storeMock,
      proposal: {
        ...storeMock,
        contractNumber: '12345',
        contractValue: 12345,
        hasProject: false,
      },
    }
    useSelectorMock.mockImplementation(select => select({ ...storeMockUpdated }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId, queryByText } = render(<ContractData handleNextStep={handleNextStepMock}/>);

    const tooltipButton = getByTestId('contract-data-button-tooltip');

    fireEvent.mouseEnter(tooltipButton);
    let tooltip = await queryByText('Você pode vincular este contrato a algum projeto já existente ou criar um novo projeto para este contrato.');
    expect(tooltip).toBeInTheDocument();

    fireEvent.mouseLeave(tooltipButton);
    tooltip = await queryByText('Você pode vincular este contrato a algum projeto já existente ou criar um novo projeto para este contrato.');
    expect(tooltip).not.toBeInTheDocument();
  })
});
