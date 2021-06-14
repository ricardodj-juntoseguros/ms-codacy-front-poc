import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { FlowModel, StepModel } from '../../types/model';

const initialState: FlowModel = {
  steps: [],
  loading: false,
};

export const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setSteps: (state, action: PayloadAction<StepModel[]>) => {
      state.steps = action.payload;
    },
    setStepStatus: (
      state,
      action: PayloadAction<{ name: string; isCompleted: boolean }>,
    ) => {
      const updatedStepIndex = state.steps.findIndex(
        step => step.name === action.payload.name,
      );
      const nextStepIndex = state.steps.findIndex(
        step => step.name === state.steps[updatedStepIndex].nextStep,
      );

      state.steps[updatedStepIndex] = {
        ...state.steps[updatedStepIndex],
        isCompleted: action.payload.isCompleted,
      };

      state.steps[nextStepIndex] = {
        ...state.steps[nextStepIndex],
        isActive: action.payload.isCompleted,
      };
    },
  },
});

export const selectFlow = (state: RootState) => state.flow;

export const { setSteps, setStepStatus } = flowSlice.actions;

export default flowSlice.reducer;
