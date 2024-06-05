import { VALIDATION_MESSAGES } from '../../../constants';
import { store } from '../../../config/store';
import { validationActions } from './ValidationSlice';

describe('ValidateSlice', () => {
  beforeEach(() => {
    store.dispatch(validationActions.clearErrorMessages());
  });

  it('should be able to populate the slice with an error', () => {
    store.dispatch(
      validationActions.setErrorMessages({
        endDate: [VALIDATION_MESSAGES.invalidDate],
      }),
    );

    const { validation } = store.getState();

    expect(validation.errors.endDate).toEqual([
      VALIDATION_MESSAGES.invalidDate,
    ]);
  });

  it('should be able to remove an error', () => {
    store.dispatch(
      validationActions.setErrorMessages({
        endDate: [VALIDATION_MESSAGES.invalidDate],
      }),
    );

    let { validation } = store.getState();

    expect(validation.errors.endDate).toEqual([
      VALIDATION_MESSAGES.invalidDate,
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
});
