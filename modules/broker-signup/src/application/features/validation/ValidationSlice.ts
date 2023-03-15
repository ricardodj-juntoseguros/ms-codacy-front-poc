import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyObjectSchema } from 'yup';
import { RootState } from '../../../config/store';
import { ValidationErrorModel, ValidationModel } from '../../types/model';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { validate } from '../../features/validations';

export interface ValidateFormModel {
  schema: AnyObjectSchema;
  data: any;
}

export const validateForm = createAsyncThunk(
  'validationSlice/validateForm',
  async ({ schema, data }: ValidateFormModel): Promise<ValidationModel> => {
    return validate(schema, data)
      .then(response => response)
      .catch(error => error);
  },
);


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
    setIsValidForm: (state, action: PayloadAction<boolean>) => {
      state.isValidForm = action.payload;
    },
  },
});

export const selectValidation = (state: RootState) => state.validation;

export const { actions: validationActions } = validationSlice;

export default validationSlice.reducer;
