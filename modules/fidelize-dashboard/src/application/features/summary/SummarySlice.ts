import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { SummaryModel } from '../../types/model';

const initialState: SummaryModel = {};

export const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setTotalPolicyholders: (state, action: PayloadAction<number>) => {
      const newTotalPolicyholders = action.payload;
      state.totalPolicyholders = newTotalPolicyholders;
    },
  },
});

export const selectPolicyholdersSummary = (state: RootState) => {
  const { totalPolicyholders } = state.summary;
  return { totalPolicyholders };
};

export const { actions: summaryActions } = summarySlice;

export default summarySlice.reducer;
