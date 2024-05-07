import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mapInsuredAddressesOption } from '../../../helpers';
import { RootState } from '../../../config/store';
import { InsuredSelectionModel } from '../../types/model/InsuredSelectionModel';
import InsuredSelectionApi from './InsuredSelectionApi';
import { InsuredModel } from '../../types/model';
import { InsuredAddressDTO, InsuredSearchDTO } from '../../types/dto';
import { InsuredAddressModel } from '../../types/model/InsuredAddressModel';

export const searchInsured = createAsyncThunk(
  'insuredSelection/searchInsured',
  async (query: string, { rejectWithValue }) => {
    return InsuredSelectionApi.searchInsured(query)
      .then(response => response)
      .catch(error => rejectWithValue(error.data));
  },
);

const initialState: InsuredSelectionModel = {
  insuredSearchValue: '',
  insuredOptions: [],
  loadingSearchInsureds: false,
  insuredAddressesOptions: [],
  hasInsuredInactive: false,
};

export const insuredSelectionSlice = createSlice({
  name: 'insuredSelection',
  initialState,
  reducers: {
    clearInsuredSelection: state => {
      state.insuredSearchValue = '';
      state.insuredOptions = [];
      state.loadingSearchInsureds = false;
      state.insuredAddressesOptions = [];
      state.hasInsuredInactive = false;
    },
    setInsuredOptions: (state, action: PayloadAction<InsuredModel[]>) => {
      state.insuredOptions = action.payload;
    },
    setInsuredSearchValue: (state, action) => {
      if (!action.payload) state.insuredOptions = [];
      state.insuredSearchValue = action.payload;
    },
    setInsuredAddressesOptions: (
      state,
      action: PayloadAction<InsuredAddressDTO[]>,
    ) => {
      state.insuredAddressesOptions = action.payload.map(
        (address: InsuredAddressDTO) => mapInsuredAddressesOption(address),
      ) as InsuredAddressModel[];
    },
    addInsuredAddressOption: (
      state,
      action: PayloadAction<InsuredAddressModel>,
    ) => {
      state.insuredAddressesOptions.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchInsured.pending, state => {
        state.loadingSearchInsureds = true;
      })
      .addCase(
        searchInsured.fulfilled,
        (state, action: PayloadAction<InsuredSearchDTO>) => {
          const { records, hasInsuredInactive } = action.payload;
          state.loadingSearchInsureds = false;
          state.insuredOptions = records
            ? records.map(insured => ({
                ...insured,
                value: insured.insuredId.toString(),
                label: insured.name,
              }))
            : [];
          state.hasInsuredInactive = hasInsuredInactive;
        },
      )
      .addCase(searchInsured.rejected, state => {
        state.loadingSearchInsureds = false;
      });
  },
});

export const selectInsuredSelection = (state: RootState) =>
  state.insuredSelection;

export const { actions: insuredSelectionActions } = insuredSelectionSlice;

export default insuredSelectionSlice.reducer;
