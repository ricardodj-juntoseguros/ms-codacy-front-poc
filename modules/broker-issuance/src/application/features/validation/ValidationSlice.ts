import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyObjectSchema } from 'yup';
import { RootState } from '../../../config/store';
import { ValidationErrorModel, ValidationModel } from '../../types/model';

export interface ValidateFormModel {
  schema: AnyObjectSchema;
  data: any;
}

const initialState: ValidationModel = {
  isValidating: false,
  isValidForm: true,
  errors: {},
};

export const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    clearErrorMessages: state => {
      state.isValidating = false;
      state.isValidForm = true;
      state.errors = {};
    },
    setErrorMessages: (state, action: PayloadAction<ValidationErrorModel>) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    removeErrorMessage: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },
    setIsValidating: (state, action: PayloadAction<boolean>) => {
      state.isValidating = action.payload;
    },
  },
});

export const selectValidation = (state: RootState) => state.validation;

export const { actions: validationActions } = validationSlice;

export default validationSlice.reducer;
