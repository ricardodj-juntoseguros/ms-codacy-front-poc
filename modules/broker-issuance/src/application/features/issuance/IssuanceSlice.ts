import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { IssuanceModel } from '../../types/model';

const initialState: IssuanceModel = {
  loadingIssuance: false,
  forceInternalize: false,
  internalizeReason: null,
};

export const issuanceSlice = createSlice({
  name: 'proposalDocuments',
  initialState,
  reducers: {
    setLoadingIssuance: (state, action: PayloadAction<boolean>) => {
      state.loadingIssuance = action.payload;
    },
    setForceInternalize: (state, action: PayloadAction<boolean>) => {
      state.forceInternalize = action.payload;
    },
    setInternalizeReason: (state, action: PayloadAction<string>) => {
      state.internalizeReason = action.payload;
    },
  },
});

export const selectIssuance = (state: RootState) => state.issuance;

export const { actions: issuanceActions } = issuanceSlice;

export default issuanceSlice.reducer;
