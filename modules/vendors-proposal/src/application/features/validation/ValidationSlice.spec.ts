/* eslint-disable prefer-promise-reject-errors */
import { configureStore } from '@reduxjs/toolkit';
import ValidationSlice, { validationActions } from './ValidationSlice';

describe('ValidationSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        validation: ValidationSlice,
      },
    });
  });

  it('should enter the error messages in the store', async () => {
    await store.dispatch(
      validationActions.setErrorMessages({
        number: ['lorem'],
        string: ['lorem'],
      }),
    );
    const { validation } = store.getState();

    expect(validation.errors).toEqual({
      number: ['lorem'],
      string: ['lorem'],
    });
    expect(validation.isValidForm).toEqual(false);
  });

  it('should remove a specific error message in the store', async () => {
    await store.dispatch(
      validationActions.setErrorMessages({
        number: ['lorem'],
        string: ['lorem'],
      }),
    );
    await store.dispatch(validationActions.removeErrorMessage('number'));
    let { validation } = store.getState();

    expect(validation.errors).toEqual({
      string: ['lorem'],
    });
    expect(validation.isValidForm).toEqual(false);

    await store.dispatch(validationActions.removeErrorMessage('string'));
    validation = store.getState().validation;

    expect(validation.errors).toEqual({});
    expect(validation.isValidForm).toEqual(true);
  });

  it('should clear error messages in store', async () => {
    await store.dispatch(validationActions.clearErrorMessages());
    const { validation } = store.getState();

    expect(validation.errors).toEqual({});
    expect(validation.isValidForm).toEqual(true);
  });

  it('should change validation status in store', async () => {
    await store.dispatch(validationActions.setIsValidating(true));
    const { validation } = store.getState();

    expect(validation.isValidating).toEqual(true);
  });
});
