import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SearchOptions } from 'junto-design-system';
import { RootState } from '../../../config/store';
import { ProposalModel } from '../../types/model';

const initialState: ProposalModel = {
  contractNumber: '',
  contractValue: 0,
  hasProject: true,
  project: null,
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
    setHasProject: (state, action: PayloadAction<boolean>) => {
      state.hasProject = action.payload;
    },
    setProject: (state, action: PayloadAction<SearchOptions | null>) => {
      state.project = action.payload;
    },
  },
});

export const selectProposal = (state: RootState) => state.proposal;

export const { actions: proposalActions } = proposalSlice;

export default proposalSlice.reducer;
