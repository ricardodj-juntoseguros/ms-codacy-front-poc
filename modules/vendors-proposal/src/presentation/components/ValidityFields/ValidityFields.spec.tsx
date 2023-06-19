import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { add, format } from 'date-fns';
import { proposalActions } from 'modules/vendors-proposal/src/application/features/proposal/ProposalSlice';
import { ValidationTypesEnum } from 'modules/vendors-proposal/src/application/types/model';
import { storeMock } from '../../../__mocks__';
import { act, fireEvent, render } from '../../../config/testUtils';
import ValidityFields from './ValidityFields';
import { WarrantyDataSchema } from '../../../application/validations/schemas';

// eslint-disable-next-line prefer-promise-reject-errors
const mockValidate = jest.fn(
  () =>
    new Promise((resolve, reject) =>
      resolve({
        errors: {},
        isValidForm: true,
        isValidating: false,
      }),
    ),
);

jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useValidate: () => mockValidate,
  };
});

describe('ValidityFields', () => {
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow the use to fill in the fields', async () => {
    useSelectorMock.mockImplementation(select => select({ ...storeMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);

    const { getByTestId } = render(
      <ValidityFields validationSchema={WarrantyDataSchema} />,
    );

    const initialDateInput = getByTestId(
      'validityFields-date-input-initial-validity',
    );
    const endDateInput = getByTestId('validityFields-date-input-end-validity');
    const validateInDaysInput = getByTestId(
      'validityFields-date-input-validity-days',
    );

    await act(async () => {
      await fireEvent.change(initialDateInput, {
        target: { value: format(new Date(), 'dd/MM/yyyy') },
      });
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setInitialValidity({
        value: format(new Date(), 'dd/MM/yyyy'),
        isValid: true,
      }),
    );

    await act(async () => {
      await fireEvent.change(endDateInput, {
        target: { value: format(add(new Date(), { days: 360 }), 'dd/MM/yyyy') },
      });
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setEndValidity({
        value: format(add(new Date(), { days: 360 }), 'dd/MM/yyyy'),
        isValid: true,
      }),
    );

    await act(async () => {
      await fireEvent.change(validateInDaysInput, {
        target: { value: 180 },
      });
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setValidityInDays(180),
    );
  });

  it('should show the errors correctly', async () => {
    const updatedStoreMock = {
      ...storeMock,
      validation: {
        ...storeMock.validation,
        isValidForm: false,
        errors: {
          initialValidity: ['O preenchimento deste campo é obrigatório'],
          endValidity: ['O preenchimento deste campo é obrigatório'],
          validityInDays: ['O preenchimento deste campo é obrigatório'],
        },
      },
    };
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);

    const { queryAllByText } = render(
      <ValidityFields validationSchema={WarrantyDataSchema} />,
    );

    const errors = queryAllByText('O preenchimento deste campo é obrigatório');

    expect(errors.length).toEqual(3);
  });

  it('should call the validator correctly', async () => {
    const updatedStoreMock = {
      ...storeMock,
      proposal: {
        ...storeMock.proposal,
        validityInDays: 360,
      },
    };
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);

    const validateObject = {
      initialValidity: updatedStoreMock.proposal.initialValidity,
      endValidity: updatedStoreMock.proposal.endValidity,
      validityInDays: updatedStoreMock.proposal.validityInDays,
    };
    const { getByTestId } = render(
      <ValidityFields validationSchema={WarrantyDataSchema} />,
    );

    const initialDateInput = getByTestId(
      'validityFields-date-input-initial-validity',
    );
    const endDateInput = getByTestId('validityFields-date-input-end-validity');
    const validateInDaysInput = getByTestId(
      'validityFields-date-input-validity-days',
    );

    await act(async () => {
      await fireEvent.click(initialDateInput);
    });
    await act(async () => {
      await fireEvent.blur(initialDateInput);
    });
    expect(mockValidate).toHaveBeenCalledWith(
      WarrantyDataSchema,
      validateObject,
      ValidationTypesEnum.partial,
      ['initialValidity', 'endValidity', 'validityInDays'],
      false,
    );

    await act(async () => {
      await fireEvent.click(endDateInput);
    });
    await act(async () => {
      await fireEvent.blur(endDateInput);
    });
    expect(mockValidate).toHaveBeenCalledWith(
      WarrantyDataSchema,
      validateObject,
      ValidationTypesEnum.partial,
      ['initialValidity', 'endValidity', 'validityInDays'],
      false,
    );

    await act(async () => {
      await fireEvent.click(validateInDaysInput);
    });
    await act(async () => {
      await fireEvent.blur(validateInDaysInput);
    });
    expect(mockValidate).toHaveBeenCalledWith(
      WarrantyDataSchema,
      validateObject,
      ValidationTypesEnum.partial,
      ['initialValidity', 'endValidity', 'validityInDays'],
      false,
    );
  });
});
