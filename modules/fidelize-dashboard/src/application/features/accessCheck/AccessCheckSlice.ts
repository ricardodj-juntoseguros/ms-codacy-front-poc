import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { AccessCheckFeatureModel, AccessCheckModel } from '../../types/model';
import AccessCheckApi from './AccessCheckApi';

export const fetchAccessToFeature = createAsyncThunk(
  'accessCheck/fetchAccessToFeature',
  async (feature: string) => {
    return AccessCheckApi.checkAccessToFeature(feature)
      .then(() => {
        return { feature, allowed: true } as AccessCheckFeatureModel;
      })
      .catch(() => {
        return { feature, allowed: false } as AccessCheckFeatureModel;
      });
  },
);

const initialState: AccessCheckModel = {
  featureAccess: [],
};

export const accessCheckSlice = createSlice({
  name: 'accessCheck',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder.addCase(fetchAccessToFeature.fulfilled, (state, action) => {
      state.featureAccess = [...state.featureAccess, action.payload];
    }),
});

export const checkAccessToFeature = (feature: string) => (state: RootState) => {
  const selectedFeature = state.accessCheck.featureAccess.find(
    featureAccess => featureAccess.feature === feature,
  );

  if (!selectedFeature) return null;
  return selectedFeature.allowed;
};

export const { actions: accessCheckSliceActions } = accessCheckSlice;

export default accessCheckSlice.reducer;
