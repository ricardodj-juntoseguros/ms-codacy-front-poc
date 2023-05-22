import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { ProposalModel } from '../../types/model';

const initialState: ProposalModel = {
  contractNumber: '',
  contractValue: 0,
};

export const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    setContractNumber: (state, action: PayloadAction<string>) => {
      state.contractNumber = action.payload;
    },
    setContractValue: (state, action: PayloadAction<number>) => {
      state.contractValue = action.payload;
    },
  },
});

export const selectProposal = (state: RootState) => state.proposal;

export const { actions: proposalActions } = proposalSlice;

export default proposalSlice.reducer;
