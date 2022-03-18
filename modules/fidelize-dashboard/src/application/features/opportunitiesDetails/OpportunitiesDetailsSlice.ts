import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { ModalityEnum, OpportunitiesDetailsModel } from '../../types/model';

const initialState: OpportunitiesDetailsModel = {
  settings: [{ modality: ModalityEnum.FISCAL, activePage: 1 }],
};

export const opportunitiesDetailsSlice = createSlice({
  name: 'opportunitiesDetails',
  initialState,
  reducers: {
    setActivePage: (
      state,
      action: PayloadAction<{ modality: ModalityEnum; page: number }>,
    ) => {
      const { modality, page } = action.payload;
      state.settings.forEach(setting => {
        if (setting.modality === modality) {
          setting.activePage = page;
        }
      });
    },
  },
});

export const selectSettingsByModality =
  (modality: ModalityEnum) => (state: RootState) =>
    state.opportunityDetails.settings.find(
      setting => setting.modality === modality,
    );

export const { actions: opportunitiesDetailsActions } =
  opportunitiesDetailsSlice;

export default opportunitiesDetailsSlice.reducer;
