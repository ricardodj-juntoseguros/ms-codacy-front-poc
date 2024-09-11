import '@testing-library/jest-dom';
import { object, string, number, boolean } from 'yup';
import { renderHook } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { ValidationTypesEnum } from 'modules/vendors-proposal/src/application/types/model';
import { storeMock } from '../../../__mocks__';
import { useValidate } from './useValidate';
import { validationActions } from '../../../application/features/validation/ValidationSlice';

describe('useValidate', () => {
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

  it('should pass validation when data meets schema requirements', async () => {
    useSelectorMock.mockImplementation(select => select({ ...storeMock }));
    useDispatchMock.mockImplementation(() => mockDispatch);
    const TestSchema = object().shape({
      number: number().required(),
      string: string().required(),
    });
    const { result } = renderHook(() => useValidate());
    const data = {
      number: 1,
      string: 'test',
    };

    await result.current(TestSchema, data);

    expect(mockDispatch).toHaveBeenCalledWith(
      validationActions.clearErrorMessages(),
    );
  });

  it('should not pass validation when data does not meet schema requirements', async () => {
    const TestSchema = object().shape({
      number: number().required(),
      string: string().required(),
      boolean: boolean().test('boolean', 'boolean', value => {
        return false;
      }),
    });
    const { result } = renderHook(() => useValidate());
    const data = {
      number: 1,
    };

    await result.current(TestSchema, data, ValidationTypesEnum.full);

    expect(mockDispatch).toHaveBeenCalledWith(
      validationActions.setErrorMessages({
        string: ['O preenchimento deste campo é obrigatório'],
        boolean: ['O preenchimento deste campo é obrigatório'],
      }),
    );
  });

  it('should pass validation when data meets requirements according to partial schema', async () => {
    const TestSchema = object().shape({
      number: number().required(),
      string: string().required(),
      boolean: boolean().test('boolean', 'boolean', value => {
        return false;
      }),
    });
    const { result } = renderHook(() => useValidate());
    const data = {
      number: 1,
    };

    await result.current(TestSchema, data, ValidationTypesEnum.partial, [
      'number',
    ]);

    expect(mockDispatch).toHaveBeenCalledWith(
      validationActions.removeErrorMessage('number'),
    );
  });
});
