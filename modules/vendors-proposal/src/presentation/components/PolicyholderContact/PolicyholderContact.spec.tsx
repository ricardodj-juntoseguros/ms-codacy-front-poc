/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import PolicyholderContactAPI from '../../../application/features/policyholderContact/PolicyholderContactAPI';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import { storeMock } from '../../../__mocks__';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import PolicyholderContact from './PolicyholderContact';

// eslint-disable-next-line prefer-promise-reject-errors
let mockValidate = jest.fn(
  () => new Promise((resolve, reject) => resolve(true)),
);

jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useValidate: () => mockValidate,
  };
});

describe('PolicyholderContact', () => {
  const handleNextStepMock = jest.fn();
  const updateTitle = jest.fn();
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  jest
    .spyOn(PolicyholderContactAPI, 'getContacts')
    .mockImplementation(() => Promise.resolve([]));

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <PolicyholderContact
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    expect(baseElement).toBeTruthy();
  });

  it('should allow the user to fill in the information in the form', async () => {
    useSelectorMock.mockImplementation(select => select({ ...storeMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(
      <PolicyholderContact
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    const inputContactName = getByTestId(
      'policyholderContact-input-contact-name',
    );
    const inputContactEmail = getByTestId(
      'policyholderContact-input-contact-email',
    );

    await act(async () => {
      await fireEvent.change(inputContactName, {
        target: { value: 'John Doe' },
      });
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setPolicyholderContact({
        ...storeMock.proposal.policyholderContact,
        name: 'John Doe',
      }),
    );

    await act(async () => {
      await fireEvent.change(inputContactEmail, {
        target: { value: 'john@doe.com' },
      });
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setPolicyholderContact({
        ...storeMock.proposal.policyholderContact,
        email: 'john@doe.com',
      }),
    );
  });

  it('should allow the user to continuation of the flow', async () => {
    const storeMockUpdated = {
      ...storeMock,
      proposal: {
        ...storeMock,
        policyholderContact: {
          id: 0,
          name: 'John Doe',
          email: 'john@doe.com',
        },
      },
    };
    useSelectorMock.mockImplementation(select =>
      select({ ...storeMockUpdated }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(
      <PolicyholderContact
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    const button = getByTestId('policyholderContact-button-next');
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(button).not.toBeDisabled();
    expect(handleNextStepMock).toHaveBeenCalledWith('John Doe - john@doe.com');
  });

  it('should inform the user if any field is invalid and not proceed with the flow', async () => {
    mockValidate = jest.fn(
      () => new Promise((resolve, reject) => resolve(false)),
    );
    const storeMockUpdated = {
      ...storeMock,
      proposal: {
        ...storeMock.proposal,
        policyholderContact: {
          id: 0,
          name: 'John Doe',
          email: 'john@doe.com',
        },
      },
      validation: {
        isValidating: false,
        isValidForm: false,
        errors: {
          name: ['O preenchimento deste campo é obrigatório'],
          email: ['O preenchimento deste campo é obrigatório'],
        },
      },
    };
    useSelectorMock.mockImplementation(select =>
      select({ ...storeMockUpdated }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId, queryAllByText } = render(
      <PolicyholderContact
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    const button = getByTestId('policyholderContact-button-next');
    await act(async () => {
      await fireEvent.click(button);
    });

    const requiredError = await queryAllByText(
      'O preenchimento deste campo é obrigatório',
    );

    expect(requiredError.length).toEqual(2);
    expect(handleNextStepMock).not.toHaveBeenCalled();
  });

  it('should enter the record in the store if the policyholder has a registered contact', async () => {
    jest.spyOn(PolicyholderContactAPI, 'getContacts').mockImplementation(() =>
      Promise.resolve([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@doe.com',
          companyFederalId: '91833813000119',
        },
      ]),
    );
    const storeMockUpdated = {
      ...storeMock,
      proposal: {
        ...storeMock,
        policyholderContact: {
          id: 0,
          name: '',
          email: '',
        },
      },
    };
    useSelectorMock.mockImplementation(select =>
      select({ ...storeMockUpdated }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { getByTestId } = render(
      <PolicyholderContact
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        proposalActions.setPolicyholderContact({
          id: 1,
          name: 'John Doe',
          email: 'john@doe.com',
          companyFederalId: '91833813000119',
        }),
      );
    });

    const inputName = getByTestId('policyholderContact-input-contact-name');
    const inputEmail = getByTestId('policyholderContact-input-contact-email');

    expect(inputName).toHaveAttribute('readonly');
    expect(inputEmail).toHaveAttribute('readonly');
    expect(updateTitle).toHaveBeenCalledWith(
      'Este será o %STRONG% Aquele que receberá a solicitação para aprovação.',
      ['contato da empresa contratada.'],
    );
  });

  it('should show a toast with error if the call returns error', async () => {
    jest.spyOn(PolicyholderContactAPI, 'getContacts').mockImplementation(() =>
      Promise.reject({
        data: {
          data: [
            {
              message: 'Erro ao retornar os contatos',
            },
          ],
        },
      }),
    );
    const storeMockUpdated = {
      ...storeMock,
      proposal: {
        ...storeMock,
        policyholderContact: {
          id: 0,
          name: '',
          email: '',
        },
      },
    };
    useSelectorMock.mockImplementation(select =>
      select({ ...storeMockUpdated }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { findByText } = render(
      <PolicyholderContact
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    const toast = await findByText('Erro ao retornar os contatos');

    expect(toast).toBeInTheDocument();
  });
});
