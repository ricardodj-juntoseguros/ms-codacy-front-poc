import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SearchOptions } from 'junto-design-system';
import { RootState } from '../../../config/store';
import {
  ProposalModel,
  ProposalPolicyholderModel,
  PolicyholderContactModel,
} from '../../types/model';

const initialState: ProposalModel = {
  contractNumber: '',
  contractValue: 0,
  insuredName: '',
  insuredFederalId: '',
  insuredAddressId: 0,
  policyholder: {},
  hasProject: true,
  project: null,
  policyholderContact: {
    id: 0,
    name: '',
    email: '',
  },
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
    setInsuredValues: (
      state,
      action: PayloadAction<{ federalId: string; name: string }>,
    ) => {
      const { federalId, name } = action.payload;
      state.insuredFederalId = federalId;
      state.insuredName = name;
      state.insuredAddressId = 0;
    },
    setInsuredAddressId: (state, action: PayloadAction<number>) => {
      state.insuredAddressId = action.payload;
    },
    setPolicyholder: (
      state,
      action: PayloadAction<ProposalPolicyholderModel>,
    ) => {
      state.policyholder = action.payload;
    },
    setPolicyholderAffiliateValues: (
      state,
      action: PayloadAction<{ id: number; federalId: string }>,
    ) => {
      const { id, federalId } = action.payload;
      state.policyholder = {
        ...state.policyholder,
        affiliateId: id,
        affiliateFederalId: federalId,
      };
    },
    setHasProject: (state, action: PayloadAction<boolean>) => {
      state.hasProject = action.payload;
    },
    setProject: (state, action: PayloadAction<SearchOptions | null>) => {
      state.project = action.payload;
    },
    setPolicyholderContact: (
      state,
      action: PayloadAction<PolicyholderContactModel>,
    ) => {
      state.policyholderContact = action.payload;
    },
  },
});

export const selectProposal = (state: RootState) => state.proposal;

export const selectProposalPolicyholder = (state: RootState) =>
  state.proposal.policyholder;

export const { actions: proposalActions } = proposalSlice;

export default proposalSlice.reducer;
