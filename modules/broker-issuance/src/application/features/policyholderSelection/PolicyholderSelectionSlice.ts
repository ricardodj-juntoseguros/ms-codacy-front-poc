import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid,
} from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import {
  PolicyholderSearchModel,
  PolicyholderSelectionModel,
} from '../../types/model';
import PolicyholderSelectionApi from './PolicyholderSelectionApi';
import { PolicyholderAffiliatesDTO } from '../../types/dto/PolicyholderAffiliatesDTO';
import {
  checkValidFederalId,
  mapPolicyholderSearchOptions,
} from '../../../helpers';
import { AFFILIATE_DEFAULT_OPTIONS } from '../../../constants';

export const searchPolicyholder = createAsyncThunk(
  'policyholderSelection/searchPolicyholder',
  async (policyholderLabel: string, { rejectWithValue }) => {
    const value = checkValidFederalId(policyholderLabel)
      ? policyholderLabel.toString().replace(/[^\d]/g, '')
      : policyholderLabel;
    return PolicyholderSelectionApi.searchPolicyHolder(value)
      .then(response => {
        if (!response.records) return [];
        const data: PolicyholderSearchModel[] =
          mapPolicyholderSearchOptions(response);
        return data;
      })
      .catch(error => rejectWithValue(error.data));
  },
);

const initialState: PolicyholderSelectionModel = {
  policyholderSearchValue: '',
  isValidFederalId: false,
  policyholderOptions: [],
  loadingSearchPolicyholder: false,
  affiliatesOptions: [],
  loadingDetails: false,
  loadingGetSubsidiaries: false,
  currentAppointmentLetter: null,
};

export const policyholderSelectionSlice = createSlice({
  name: 'policyholderSelection',
  initialState,
  reducers: {
    clearPolicyholderSelection: state => {
      state.policyholderSearchValue = '';
      state.isValidFederalId = false;
      state.policyholderOptions = [];
      state.loadingSearchPolicyholder = false;
      state.affiliatesOptions = [];
      state.loadingDetails = false;
      state.loadingGetSubsidiaries = false;
    },
    setPolicyholderSearchValue: (state, action: PayloadAction<string>) => {
      if (!action.payload) state.policyholderOptions = [];
      state.policyholderSearchValue = action.payload;
    },
    setPolicyholderOptions: (
      state,
      action: PayloadAction<PolicyholderSearchModel[]>,
    ) => {
      state.policyholderOptions = action.payload;
    },
    setPolicyholderAffiliatesOptions: (
      state,
      action: PayloadAction<PolicyholderAffiliatesDTO[]>,
    ) => {
      state.affiliatesOptions = action.payload.map(affiliate => ({
        ...affiliate,
        label: `${affiliate.city} - ${affiliate.state} - CNPJ: ${affiliate.federalId}`,
        value: nanoid(5),
      }));

      if (state.affiliatesOptions.length > 0) {
        state.affiliatesOptions = state.affiliatesOptions.concat(
          Object.values(AFFILIATE_DEFAULT_OPTIONS),
        );
      }
    },
    setCurrentAppointmentLetter: (
      state,
      action: PayloadAction<{ filename: string; size: number } | null>,
    ) => {
      const { payload } = action;
      state.currentAppointmentLetter = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchPolicyholder.pending, state => {
        state.isValidFederalId = false;
        state.currentAppointmentLetter = null;
        state.loadingSearchPolicyholder = true;
      })
      .addCase(searchPolicyholder.fulfilled, (state, action) => {
        if (checkValidFederalId(state.policyholderSearchValue)) {
          state.policyholderSearchValue =
            action.payload[0]?.label || state.policyholderSearchValue;
          state.isValidFederalId = true;
        }
        state.loadingSearchPolicyholder = false;
        state.policyholderOptions = action.payload;
      })
      .addCase(searchPolicyholder.rejected, state => {
        state.loadingSearchPolicyholder = false;
      });
  },
});

export const selectPolicyholder = (state: RootState) =>
  state.policyholderSelection;

export const { actions: policyholderSelectionActions } =
  policyholderSelectionSlice;

export default policyholderSelectionSlice.reducer;
