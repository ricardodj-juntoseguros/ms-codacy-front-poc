import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import {
  ModalityEnum,
  OpportunitiesDetailsModel,
  OpportunityDetailsOrderEnum,
} from '../../types/model';

const initialState: OpportunitiesDetailsModel = {
  settings: [
    {
      modality: ModalityEnum.FISCAL,
      activePage: 1,
      pageSize: 10,
      orderBy: OpportunityDetailsOrderEnum.RELEVANCE,
      direction: 'desc',
    },
    {
      modality: ModalityEnum.TRABALHISTA,
      activePage: 1,
      pageSize: 10,
      orderBy: OpportunityDetailsOrderEnum.RELEVANCE,
      direction: 'desc',
    },
  ],
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
    setPageSize: (
      state,
      action: PayloadAction<{ modality: ModalityEnum; pageSize: number }>,
    ) => {
      const { modality, pageSize } = action.payload;
      state.settings.forEach(setting => {
        if (setting.modality === modality) {
          setting.pageSize = pageSize;
        }
      });
    },
    setOrderAndDirection: (
      state,
      action: PayloadAction<{
        modality: ModalityEnum;
        orderBy: OpportunityDetailsOrderEnum;
        direction: 'asc' | 'desc';
      }>,
    ) => {
      const { modality, orderBy, direction } = action.payload;
      state.settings.forEach(setting => {
        if (setting.modality === modality) {
          setting.orderBy = orderBy;
          setting.direction = direction;
          setting.activePage = 1;
        }
      });
    },
    resetSettings: state => {
      state.settings.forEach(setting => {
        setting.pageSize = 10;
        setting.activePage = 1;
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
