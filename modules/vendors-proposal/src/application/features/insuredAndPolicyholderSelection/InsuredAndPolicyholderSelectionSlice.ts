import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { makeToast } from 'junto-design-system';
import { federalIdValidator } from '@shared/utils';
import { RootState } from '../../../config/store';
import { InsuredAndPolicyholderSelectionModel } from '../../types/model';
import { PolicyholderAffiliateDTO, PolicyholderDTO } from '../../types/dto';
import InsuredAndPolicyholderSelectionApi from './InsuredAndPolicyholderSelectionApi';

const initialState: InsuredAndPolicyholderSelectionModel = {
  policyholderInputValue: '',
  policyholderResults: null,
  loadingPolicyholders: false,
  isValidFederalId: false,
  policyholderAffiliateResults: null,
};

export const searchPolicyholders = createAsyncThunk<
  PolicyholderDTO[],
  string,
  { rejectValue: string }
>(
  'insuredAndPolicyholderSelection/searchPolicyholders',
  async (inputtedValue: string, { rejectWithValue }) => {
    const isFederalId = federalIdValidator(inputtedValue, 'partial');
    const federalId = isFederalId
      ? inputtedValue.replace(/[^\d]+/g, '')
      : undefined;
    const corporateName = isFederalId ? undefined : inputtedValue;
    return new InsuredAndPolicyholderSelectionApi()
      .getPolicyholders(federalId, corporateName)
      .then(response => response)
      .catch(error => rejectWithValue(error.data.data.message));
  },
);

export const getPolicyholderAffiliates = createAsyncThunk<
  PolicyholderAffiliateDTO[],
  string,
  { rejectValue: string }
>(
  'insuredAndPolicyholderSelection/getPolicyholderAffiliates',
  async (policyholderFederalId: string, { rejectWithValue }) => {
    return new InsuredAndPolicyholderSelectionApi()
      .getPolicyholderAffiliates(policyholderFederalId)
      .then(response => response)
      .catch(error => rejectWithValue(error.data.data.message));
  },
);

export const insuredAndPolicyholderSelectionSlice = createSlice({
  name: 'insuredAndPolicyholderSelection',
  initialState,
  reducers: {
    setPolicyholderInputValue: (state, action: PayloadAction<string>) => {
      state.policyholderInputValue = action.payload;
      if (action.payload.length === 0) {
        state.policyholderResults = null;
        state.policyholderAffiliateResults = null;
      }
    },
    setPolicyholderResults: (
      state,
      action: PayloadAction<PolicyholderDTO[]>,
    ) => {
      state.policyholderResults = action.payload;
    },
    setPolicyholderAffiliateResults: (
      state,
      action: PayloadAction<PolicyholderAffiliateDTO[] | null>,
    ) => {
      state.policyholderAffiliateResults = action.payload;
    },
    setIsValidFederalId: (state, action: PayloadAction<boolean>) => {
      state.isValidFederalId = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(searchPolicyholders.fulfilled, (state, action) => {
        state.policyholderResults = action.payload;
        state.loadingPolicyholders = false;
      })
      .addCase(searchPolicyholders.pending, state => {
        state.loadingPolicyholders = true;
      })
      .addCase(searchPolicyholders.rejected, (state, action) => {
        state.policyholderResults = [];
        state.loadingPolicyholders = false;
        if (action.payload) makeToast('error', action.payload);
      })
      .addCase(getPolicyholderAffiliates.pending, state => {
        state.loadingPolicyholders = true;
      })
      .addCase(getPolicyholderAffiliates.rejected, (state, action) => {
        state.policyholderAffiliateResults = [];
        state.loadingPolicyholders = false;
        if (action.payload) makeToast('error', action.payload);
      })
      .addCase(getPolicyholderAffiliates.fulfilled, (state, action) => {
        state.policyholderAffiliateResults = action.payload;
        state.loadingPolicyholders = false;
      }),
});

export const selectInsuredAndPolicyholderSelection = (state: RootState) =>
  state.insuredAndPolicyholderSelection;

export const { actions: insuredAndPolicyholderSelectionActions } =
  insuredAndPolicyholderSelectionSlice;

export default insuredAndPolicyholderSelectionSlice.reducer;
