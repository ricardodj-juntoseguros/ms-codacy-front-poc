import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { SummaryChartDataDTO } from '../../types/dto';
import {
  ModalityEnum,
  SummaryChartsModel,
  SummaryChartTypeEnum,
} from '../../types/model';
import SummaryChartsApi from './SummaryChartsApi';

const initialState: SummaryChartsModel = {
  charts: [
    {
      modality: ModalityEnum.FISCAL,
      chartType: SummaryChartTypeEnum.RENEWAL,
      loading: true,
      error: false,
      data: null,
    },
    {
      modality: ModalityEnum.FISCAL,
      chartType: SummaryChartTypeEnum.SUBSTITUTION,
      loading: true,
      error: false,
      data: null,
    },
    {
      modality: ModalityEnum.FISCAL,
      chartType: SummaryChartTypeEnum.NEW_ISSUES,
      loading: false,
      error: false,
      data: {} as SummaryChartDataDTO,
    },
  ],
};

export const fetchChartData = createAsyncThunk(
  'summaryCharts/fetchChartData',
  async (params: {
    modality: ModalityEnum;
    chartType: SummaryChartTypeEnum;
    federalids: string[];
  }) => {
    const { modality, chartType, federalids } = params;
    const response = await SummaryChartsApi.getChartData(
      modality,
      chartType,
      federalids,
    );
    return response;
  },
);

const summaryChartsSlice = createSlice({
  name: 'summaryCharts',
  initialState,
  reducers: {
    clearAllChartsData: state => {
      state.charts.forEach(chart => {
        chart.data = chart.chartType === SummaryChartTypeEnum.NEW_ISSUES ? {} as SummaryChartDataDTO : null;
      });
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchChartData.pending, (state, action) => {
        const {
          meta: {
            arg: { modality, chartType },
          },
        } = action;
        const newState = state.charts.map(chart => {
          if (chart.modality !== modality || chart.chartType !== chartType)
            return chart;
          return { ...chart, loading: true, error: false };
        });
        state.charts = newState;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        const {
          payload,
          meta: {
            arg: { modality, chartType },
          },
        } = action;
        const newState = state.charts.map(chart => {
          if (chart.modality !== modality || chart.chartType !== chartType)
            return chart;
          return { ...chart, loading: false, error: false, data: payload };
        });
        state.charts = newState;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        const {
          meta: {
            arg: { modality, chartType },
          },
        } = action;
        const newState = state.charts.map(chart => {
          if (chart.modality !== modality || chart.chartType !== chartType)
            return chart;
          return { ...chart, loading: false, error: true, data: null };
        });
        state.charts = newState;
      }),
});

export const selectChartData =
  (modality: ModalityEnum, chartType: SummaryChartTypeEnum) =>
  (state: RootState) => {
    const chart = state.summaryCharts.charts.find(
      chart => chart.modality === modality && chart.chartType === chartType,
    );
    if (!chart) return null;
    const { loading, data, error } = chart;
    return { loading, data, error };
  };

export const { actions: summaryChartsActions } = summaryChartsSlice;

export default summaryChartsSlice.reducer;
