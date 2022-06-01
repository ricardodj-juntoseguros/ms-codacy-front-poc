import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { store } from '../../../config/store';
import { validateForm, validationActions } from './ValidationSlice';
import { CoverageDataSchema } from '../../validations/schemas/componentSchemas';

describe('ValidateSlice', () => {
  beforeEach(() => {
    store.dispatch(validationActions.clearErrorMessages());
  });

  it('should be able to populate the slice with an error', () => {
    store.dispatch(
      validationActions.setErrorMessages({
        endDate: [VALIDATION_MESSAGES.minValidity],
      }),
    );

    const { validation } = store.getState();

    expect(validation.errors.endDate).toEqual([
      VALIDATION_MESSAGES.minValidity,
    ]);
  });

  it('should be able to remove an error', () => {
    store.dispatch(
      validationActions.setErrorMessages({
        endDate: [VALIDATION_MESSAGES.minValidity],
      }),
    );

    let { validation } = store.getState();

    expect(validation.errors.endDate).toEqual([
      VALIDATION_MESSAGES.minValidity,
    ]);

    store.dispatch(validationActions.removeErrorMessage('endDate'));
    validation = store.getState().validation;

    expect(validation.errors).toMatchObject({});
  });

  it('should be able to change the state of the isValidating property', () => {
    store.dispatch(validationActions.setIsValidating(true));

    const { validation } = store.getState();

    expect(validation.isValidating).toEqual(true);
  });

  it('should be able to change the state of the isValidating property', async () => {
    const mockData = {
      coverageData: {
        startDate: '27/05/2022',
        endDate: '27/05/2023',
        durationInDays: 365,
        securedAmount: 1000,
      },
    };

    await store.dispatch(
      validateForm({
        schema: CoverageDataSchema,
        data: mockData,
      }),
    );

    const { validation } = store.getState();

    expect(validation.isValidating).toEqual(false);
    expect(validation.isValidForm).toEqual(true);
    expect(validation.errors).toMatchObject({});
  });
});
