import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { FlowModel, StepModel } from '../../types/model';
import { defaultStep } from '../../../constants';

const initialState: FlowModel = {
  steps: [defaultStep],
};

export const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setSteps: (state, action: PayloadAction<StepModel[]>) => {
      state.steps = action.payload;
    },
    advanceStep: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;
      const lastElement = state.steps[state.steps.length - 1];
      const isLastStep = lastElement.name === name;

      if (!isLastStep) {
        state.steps.forEach((step, index) => {
          if (step.name === name) {
            step.isActive = false;
            step.isCompleted = true;
            const nextStep = state.steps[index + 1];
            nextStep.isActive = true;
          }
        });
      }
    },
    goBackStep: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;
      const firstElement = state.steps[0];
      const isFirstStep = firstElement.name === name;

      if (!isFirstStep) {
        state.steps.forEach((step, index) => {
          if (step.name === name) {
            step.isActive = false;
            step.isCompleted = false;
            const previousStep = state.steps[index - 1];
            previousStep.isActive = true;
          }
        });
      }
    },
    setStepStatus: (
      state,
      action: PayloadAction<{
        name: string;
        isVisible: boolean;
        isEnabled: boolean;
        isLoading: boolean;
      }>,
    ) => {
      const { name, isVisible, isEnabled, isLoading } = action.payload;

      const stepsUpdated = state.steps.map(step => {
        if (step.name === name) {
          return {
            ...step,
            isVisible,
            isEnabled,
            isLoading,
          };
        }

        return step;
      });

      state.steps = stepsUpdated;
    },
  },
});

export const selectFlow = (state: RootState) => state.flow;

export const { setSteps, advanceStep, goBackStep, setStepStatus } =
  flowSlice.actions;

export default flowSlice.reducer;
