import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { store } from '../../../config/store';
import { validationActions } from './ValidationSlice';

describe('ValidateSlice', () => {
  beforeEach(() => {
    store.dispatch(validationActions.clearErrorMessages());
  });

  it('should be able to populate the slice with an error', () => {
    store.dispatch(
      validationActions.setErrorMessages({
        name: [VALIDATION_MESSAGES.nameResponsible],
      }),
    );

    const { validation } = store.getState();

    expect(validation.errors.name).toEqual([
      VALIDATION_MESSAGES.nameResponsible,
    ]);
  });

  it('should be able to remove an error', () => {
    store.dispatch(
      validationActions.setErrorMessages({
        name: [VALIDATION_MESSAGES.nameResponsible],
      }),
    );

    let { validation } = store.getState();

    expect(validation.errors.name).toEqual([
      VALIDATION_MESSAGES.nameResponsible,
    ]);

    store.dispatch(validationActions.removeErrorMessage('name'));
    validation = store.getState().validation;

    expect(validation.errors).toMatchObject({});
  });

  it('should be able to change the state of the isValidating property', () => {
    store.dispatch(validationActions.setIsValidating(true));

    const { validation } = store.getState();

    expect(validation.isValidating).toEqual(true);
  });
});
