import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SearchOptions, makeToast } from 'junto-design-system';
import { add, differenceInCalendarDays, format, isValid } from 'date-fns';
import { parseStringToDate } from '@shared/utils';
import { ERROR_MESSAGES } from '../../../constants';
import { getProposalValue } from '../../../helpers';
import { RootState } from '../../../config/store';
import {
  ProposalPolicyholderModel,
  PolicyholderContactModel,
  ModalityModel,
  ProposalModel,
} from '../../types/model';
import { ProposalDTO } from '../../types/dto';
import ProposalAPI from './ProposalAPI';
import { ProposalResultDTO } from '../../types/dto/ProposalResultDTO';

export const createProposal = createAsyncThunk<
  ProposalResultDTO,
  ProposalDTO,
  { rejectValue: string }
>(
  'proposal/createProposal',
  async (payload: ProposalDTO, { rejectWithValue }) => {
    return ProposalAPI.createProposal(payload)
      .then(response => response)
      .catch(error => {
        const message =
          error.data && error.data.data && error.data.data[0].message
            ? error.data.data[0].message
            : ERROR_MESSAGES.createProposal;

        return rejectWithValue(message);
      });
  },
);

export const updateProposal = createAsyncThunk<
  ProposalResultDTO,
  { proposalId: number; payload: ProposalDTO },
  { rejectValue: string }
>(
  'proposal/updateProposal',
  async ({ proposalId, payload }, { rejectWithValue }) => {
    return ProposalAPI.updateProposal(proposalId, payload)
      .then(response => response)
      .catch(error => {
        const message =
          error.data && error.data.data && error.data.data[0].message
            ? error.data.data[0].message
            : ERROR_MESSAGES.updatedProposal;

        return rejectWithValue(message);
      });
  },
);

const initialState: ProposalModel = {
  identification: null,
  contractNumber: '',
  contractValue: 0,
  insuredName: '',
  insuredFederalId: '',
  insuredAddressId: 0,
  policyholder: {},
  hasProject: true,
  project: null,
  policyholderContact: {
    id: '',
    name: '',
    email: '',
  },
  initialValidity: format(new Date(), 'dd/MM/yyyy'),
  endValidity: '',
  validityInDays: NaN,
  warrantyPercentage: NaN,
  modality: {} as ModalityModel,
  additionalCoverageLabor: false,
  totalValue: 0,
  createProposalLoading: false,
  createProposalSuccess: false,
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

      if (state.warrantyPercentage) {
        state.totalValue = getProposalValue(
          state.contractValue,
          state.warrantyPercentage,
        );
      }
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
    setInitialValidity: (
      state,
      action: PayloadAction<{ value: string; isValid: boolean }>,
    ) => {
      state.initialValidity = action.payload.value;

      if (action.payload.isValid) {
        state.validityInDays = differenceInCalendarDays(
          parseStringToDate(action.payload.value),
          parseStringToDate(state.endValidity),
        );
      }
    },
    setEndValidity: (
      state,
      action: PayloadAction<{ value: string; isValid: boolean }>,
    ) => {
      state.endValidity = action.payload.value;
      if (action.payload.isValid) {
        state.validityInDays = differenceInCalendarDays(
          parseStringToDate(action.payload.value),
          parseStringToDate(state.initialValidity),
        );
      }
    },
    setValidityInDays: (state, action: PayloadAction<number>) => {
      state.validityInDays = action.payload;

      if (isValid(parseStringToDate(state.initialValidity))) {
        state.endValidity = format(
          add(parseStringToDate(state.initialValidity), {
            days: action.payload,
          }),
          'dd/MM/yyyy',
        );
      }
    },
    setWarrantyPercentage: (state, action: PayloadAction<number>) => {
      state.warrantyPercentage = action.payload;

      if (state.contractValue) {
        state.totalValue = getProposalValue(
          state.contractValue,
          state.warrantyPercentage,
        );
      }
    },
    setModality: (state, action: PayloadAction<ModalityModel>) => {
      state.modality = action.payload;
    },
    setAdditionalCoverageLabor: (state, action: PayloadAction<boolean>) => {
      state.additionalCoverageLabor = action.payload;
    },
    setCreateProposalSuccess: (state, action: PayloadAction<boolean>) => {
      state.createProposalSuccess = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createProposal.pending, state => {
        state.createProposalLoading = true;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.identification = {
          proposalId: action.payload.ProposalId,
          policyId: action.payload.PolicyId,
          quotationId: action.payload.QuotationId,
          newQuoterId: action.payload.NewQuoterId,
        };

        state.createProposalSuccess = true;
        state.createProposalLoading = false;
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.createProposalLoading = false;
        state.createProposalSuccess = false;
        if (action.payload) makeToast('error', action.payload);
      })
      .addCase(updateProposal.pending, state => {
        state.createProposalLoading = true;
      })
      .addCase(updateProposal.fulfilled, (state, action) => {
        state.identification = {
          proposalId: action.payload.ProposalId,
          policyId: action.payload.PolicyId,
          quotationId: action.payload.QuotationId,
          newQuoterId: action.payload.NewQuoterId,
        };
        state.createProposalSuccess = true;
        state.createProposalLoading = false;
      })
      .addCase(updateProposal.rejected, (state, action) => {
        state.createProposalLoading = false;
        state.createProposalSuccess = false;
        if (action.payload) makeToast('error', action.payload);
      });
  },
});

export const selectProposal = (state: RootState) => state.proposal;

export const selectProposalPolicyholder = (state: RootState) =>
  state.proposal.policyholder;

export const { actions: proposalActions } = proposalSlice;

export default proposalSlice.reducer;
