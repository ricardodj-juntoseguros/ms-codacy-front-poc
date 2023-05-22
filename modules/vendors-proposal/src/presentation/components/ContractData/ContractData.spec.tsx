import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { proposalActions } from 'modules/vendors-proposal/src/application/features/proposal/ProposalSlice';
import { nanoid } from '@reduxjs/toolkit';
import ContractData from './ContractData';
import * as contextFile from '../../../config/filesContext';
import { act, fireEvent, prettyDOM, render } from '../../../config/testUtils';
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
    useSelectorMock.mockImplementation(select => select({ ...storeMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(<ContractData handleNextStep={handleNextStepMock}/>);

    const contractNumberInput = getByTestId('contractData-input-contract-number');
    const contractValueInput = getByTestId('contractData-input-contract-value');
    const uploadFileInput = getByTestId('input-files');

    await act(async () => {
      await fireEvent.change(contractNumberInput, { target: { value: '12345' } });
    });
    await act(async () => {
      await fireEvent.change(contractValueInput, { target: { value: 12345 } });
    });
    await act(async () => {
      await fireEvent.change(uploadFileInput, { target: { files: [file] } });
    });

    expect(mockDispatch).toHaveBeenCalledWith(proposalActions.setContractNumber('12345'));
    expect(mockDispatch).toHaveBeenCalledWith(proposalActions.setContractValue(12345));
    expect(handleSetFilesMock).toHaveBeenCalled();
  });

  it('should allow the user to continuation of the flow', async () => {
    const storeMockUpdated = {
      ...storeMock,
      proposal: {
        contractNumber: '12345',
        contractValue: 12345,
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
      },
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    mockValidate = jest.fn(() => (new Promise((resolve, reject) => resolve({
      errors: {
        contractNumber: ['O preenchimento deste campo é obrigatório'],
        contractValue: ['Valor menor que o mínimo permitido.'],
        files: ['Valor menor que o mínimo permitido.']
      },
      isValidForm: false,
      isValidating: false
    }))));
    useSelectorMock.mockImplementation(select => select({ ...storeMockUpdated }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId, queryByText } = render(<ContractData handleNextStep={handleNextStepMock}/>);

    const button = getByTestId('contractData-button-next');
    await act(async () => {
      await fireEvent.click(button);
    });

    const requiredError = await queryByText('O preenchimento deste campo é obrigatório');
    const minError = await queryByText('Valor menor que o mínimo permitido.');

    expect(requiredError).toBeInTheDocument();
    expect(minError).toBeInTheDocument();
    expect(handleNextStepMock).not.toHaveBeenCalled();
  });
});
