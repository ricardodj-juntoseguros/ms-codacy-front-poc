import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'modules/corretor-emissao/src/config/store';
import { SearchInsuredModel } from '../../types/model';

import {
  searchInsured,
  searchInsuredFulFilled,
  searchInsuredPending,
  searchInsuredRejected,
} from './thunks/SearchInsuredThunk';

const initialState: SearchInsuredModel = {
  searchInsuredOptions: [],
  loading: false,
};

export const searchInsuredSlice = createSlice({
  name: 'searchInsured',
  initialState,
  reducers: {
    resetSearchInsured: state => {
      state.searchInsuredOptions = [];
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchInsured.pending, searchInsuredPending)
      .addCase(searchInsured.fulfilled, searchInsuredFulFilled)
      .addCase(searchInsured.rejected, searchInsuredRejected);
  },
});

export const selectSearchInsured = (state: RootState) => state.searchInsured;

export const { actions: searchInsuredSliceActions } = searchInsuredSlice;

export default searchInsuredSlice.reducer;
