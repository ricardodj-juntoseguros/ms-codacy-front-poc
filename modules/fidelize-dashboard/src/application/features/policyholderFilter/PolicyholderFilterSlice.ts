import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { PolicyholderFilterModel } from '../../types/model';

const initialState: PolicyholderFilterModel = {
  policyholderSelection: [],
};

export const policyholderFilterSlice = createSlice({
  name: 'policyholderFilter',
  initialState,
  reducers: {
    setPolicyholderSelection: (
      state,
      action: PayloadAction<{ selection: string[] }>,
    ) => {
      const { selection } = action.payload;
      state.policyholderSelection = selection;
    },
  },
});

export const selectPolicyholderSelection = (state: RootState) =>
  state.policyholderFilter.policyholderSelection;

export const { actions: policyholderFilterActions } = policyholderFilterSlice;

export default policyholderFilterSlice.reducer;
