import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "modules/broker-issuance/src/config/store";
import { InsuredSelectionModel } from "../../types/model/InsuredSelectionModel";
import InsuredSelectionApi from "./InsuredSelectionApi";
import { InsuredModel } from "../../types/model";
import { InsuredAddressModel } from "../../types/model/InsuredAddressModel";

export const searchInsured = createAsyncThunk(
  'insuredSelection/searchInsured',
  async (query: string, { rejectWithValue }) => {
    return InsuredSelectionApi.searchInsured(query)
      .then(response => {
        if (!response.records) return [];
        const data: InsuredModel[] = response.records.map(
          insured => ({
            ...insured,
            value: insured.insuredId.toString(),
            label: insured.name,
          }),
        );
        return data;
      })
      .catch(error => rejectWithValue(error.data));
  },
);

const initialState: InsuredSelectionModel = {
  insuredSearchValue: '',
  insuredOptions: [],
  loadingSearchInsureds: false,
  insuredAddressesOptions: [],
};

export const insuredSelectionSlice = createSlice({
  name: 'insuredSelection',
  initialState,
  reducers: {
    clearInsuredSelection: state => {
      state.insuredSearchValue = '';
      state.insuredOptions = [];
      state.loadingSearchInsureds = false;
    },
    setInsuredSearchValue: (state, action) => {
      if (!action.payload) state.insuredOptions = [];
      state.insuredSearchValue = action.payload;
    },
    setInsuredAddressesOptions: (state, action) => {
      state.insuredAddressesOptions = action.payload.map((address: InsuredAddressModel) => ({
        ...address,
        value: address.addressId.toString(),
        label: `${address.street} - ${address.city}, ${address.state}`
      }));
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchInsured.pending, state => {
        state.loadingSearchInsureds = true;
      })
      .addCase(searchInsured.fulfilled, (state, action) => {
        state.loadingSearchInsureds = false;
        state.insuredOptions = action.payload;
      })
      .addCase(searchInsured.rejected, state => {
        state.loadingSearchInsureds = false;
      });
  },
});

export const selectInsuredSelection = (state: RootState) => state.insuredSelection;

export const { actions: insuredSelectionActions } = insuredSelectionSlice;

export default insuredSelectionSlice.reducer;
