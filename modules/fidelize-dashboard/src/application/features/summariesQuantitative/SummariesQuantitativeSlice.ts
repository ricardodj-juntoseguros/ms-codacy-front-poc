import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'modules/fidelize-dashboard/src/config/store';
import { SummariesQuantitativeModel } from '../../types/model/SummariesQuantitativeModel';

const initialState: SummariesQuantitativeModel = {
  SummariesQuantitativeByPolicyholder: [],
};

export const summariesQuantitativeSlice = createSlice({
  name: 'summariesQuantitativeSlice',
  initialState,
  reducers: {
    setSummariesQuantitative: (state, action) => {
      state.SummariesQuantitativeByPolicyholder = action.payload;
    },
  },
});

export const { actions: summariesQuantitativeActions } =
  summariesQuantitativeSlice;

export const summariesQuantitativeByPolicyholder = (state: RootState) =>
  state.summariesQuantitative.SummariesQuantitativeByPolicyholder;

export default summariesQuantitativeSlice.reducer;
