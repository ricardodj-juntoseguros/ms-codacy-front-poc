import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { MappingRequestsListModel, MappingStatusEnum } from '../../types/model';

const initialState: MappingRequestsListModel = {
  settings: [
    {
      mappingStatus: MappingStatusEnum.ON_QUEUE,
      activePage: 1,
      pageSize: 10,
    },
    {
      mappingStatus: MappingStatusEnum.DONE,
      activePage: 1,
      pageSize: 10,
    },
    {
      mappingStatus: MappingStatusEnum.BLOCKED,
      activePage: 1,
      pageSize: 10,
    },
  ],
};

const mappingRequestsListSlice = createSlice({
  name: 'mappingRequestsList',
  initialState,
  reducers: {
    setActivePage: (
      state,
      action: PayloadAction<{ status: MappingStatusEnum; page: number }>,
    ) => {
      const { status, page } = action.payload;
      state.settings.forEach(setting => {
        if (setting.mappingStatus === status) {
          setting.activePage = page;
        }
      });
    },
    setPageSize: (
      state,
      action: PayloadAction<{ status: MappingStatusEnum; pageSize: number }>,
    ) => {
      const { status, pageSize } = action.payload;
      state.settings.forEach(setting => {
        if (setting.mappingStatus === status) {
          setting.pageSize = pageSize;
        }
      });
    },
  },
});

export const selectSettingsByMappingStatus =
  (status: MappingStatusEnum) => (state: RootState) => {
    const selectedSetting = state.mappingRequestsList.settings.find(
      setting => setting.mappingStatus === status,
    );

    if (!selectedSetting) return null;
    return selectedSetting;
  };

export const { actions: mappingRequestsListSliceActions } =
  mappingRequestsListSlice;

export default mappingRequestsListSlice.reducer;
