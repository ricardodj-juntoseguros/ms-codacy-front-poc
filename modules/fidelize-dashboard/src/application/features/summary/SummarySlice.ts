import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { SummaryModel } from '../../types/model';

const initialState: SummaryModel = {
  errorPolicyholders: false,
};

export const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setTotalPolicyholders: (state, action: PayloadAction<number>) => {
      const newTotalPolicyholders = action.payload;
      state.totalPolicyholders = newTotalPolicyholders;
    },
    setErrorPolicyholders: (state, action: PayloadAction<boolean>) => {
      const newErrorPolicyholders = action.payload;
      state.errorPolicyholders = newErrorPolicyholders;
    },
  },
});

export const selectPolicyholdersSummary = (state: RootState) => {
  const { totalPolicyholders, errorPolicyholders } = state.summary;
  return { totalPolicyholders, errorPolicyholders };
};

export const { actions: summaryActions } = summarySlice;

export default summarySlice.reducer;
