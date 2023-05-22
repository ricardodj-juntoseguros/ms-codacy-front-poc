import '@testing-library/jest-dom';
import { object, string, number, boolean } from 'yup';
import { renderHook } from '@testing-library/react-hooks';
import { useValidate } from './useValidate';

describe('useValidate', () => {
  it('should pass validation when data meets schema requirements', async () => {
    const { result } = renderHook(useValidate);
    const TestSchema = object().shape({
      number: number().required(),
      string: string().required(),
    });
    const data = {
      number: 1,
      string: 'test',
    };

    const validateResult = await result.current(TestSchema, data);

    expect(validateResult.isValidForm).toEqual(true);
    expect(validateResult.errors).toEqual({});
  });

  it('should not pass validation when data does not meet schema requirements', async () => {
    const { result } = renderHook(useValidate);
    const TestSchema = object().shape({
      number: number().required(),
      string: string().required(),
      boolean: boolean().test('boolean', 'boolean', value => {
        return false;
      }),
    });
    const data = {
      number: 1,
    };

    const validateResult = await result.current(TestSchema, data);

    expect(validateResult.isValidForm).toEqual(false);
    expect(validateResult.errors).toEqual({
      string: ['O preenchimento deste campo é obrigatório'],
      boolean: ['O preenchimento deste campo é obrigatório'],
    });
  });
});
