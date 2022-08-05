import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { makeToast } from 'junto-design-system';
import { RootState } from '../../../config/store';
import { OpportunityDetailsItemDTO } from '../../types/dto';
import {
  ModalityEnum,
  OpportunitiesDetailsFilterModel,
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
      filters: [],
    },
    {
      modality: ModalityEnum.TRABALHISTA,
      activePage: 1,
      pageSize: 10,
      orderBy: OpportunityDetailsOrderEnum.RELEVANCE,
      direction: 'desc',
      filters: [],
    },
  ],
  selectedOpportunities: [],
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
    addOpportunityToSelection: (
      state,
      action: PayloadAction<OpportunityDetailsItemDTO>,
    ) => {
      if (state.selectedOpportunities.length === 20) {
        makeToast('warning', 'Você pode selecionar no máximo 20');
        return;
      }
      const { payload } = action;
      state.selectedOpportunities.push(payload);
    },
    removeOpportunityFromSelection: (
      state,
      action: PayloadAction<OpportunityDetailsItemDTO>,
    ) => {
      const { payload } = action;
      state.selectedOpportunities = state.selectedOpportunities.filter(
        op => op.id !== payload.id,
      );
    },
    clearOpportunitySelection: state => {
      state.selectedOpportunities = [];
    },
    setFilter: (
      state,
      action: PayloadAction<{
        modality: ModalityEnum;
        filter: OpportunitiesDetailsFilterModel;
      }>,
    ) => {
      const { modality, filter } = action.payload;
      state.settings.forEach(setting => {
        if (setting.modality === modality) {
          const currentFilter = setting.filters.find(f => f.key === filter.key);
          if (!currentFilter) {
            setting.filters = [...setting.filters, filter];
          } else {
            currentFilter.values = filter.values;
          }
          setting.activePage = 1;
        }
      });
    },
    clearFiltersByModality: (state, action: PayloadAction<ModalityEnum>) => {
      state.settings.forEach(setting => {
        if (setting.modality === action.payload) {
          setting.filters = [];
          setting.activePage = 1;
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

export const selectFiltersByModality =
  (modality: ModalityEnum) => (state: RootState) => {
    const modalitySettings = state.opportunityDetails.settings.find(
      setting => setting.modality === modality,
    );
    if (!modalitySettings) return [];
    return modalitySettings.filters;
  };

export const selectFilterValues =
  (modality: ModalityEnum, filterKey: string) => (state: RootState) => {
    const modalitySettings = state.opportunityDetails.settings.find(
      setting => setting.modality === modality,
    );
    if (!modalitySettings) return null;
    const filter = modalitySettings.filters.find(f => f.key === filterKey);
    if (!filter) return null;
    return filter.values;
  };

export const selectSelectedOpportunities = (state: RootState) =>
  state.opportunityDetails.selectedOpportunities;

export const { actions: opportunitiesDetailsActions } =
  opportunitiesDetailsSlice;

export default opportunitiesDetailsSlice.reducer;
