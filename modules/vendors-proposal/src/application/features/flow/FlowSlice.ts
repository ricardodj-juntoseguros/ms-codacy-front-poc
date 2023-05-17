import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../config/store';
import { FlowModel } from '../../types/model/FlowModel';
import { StepModel } from '../../types/model';
import { StepStatusEnum } from '../../types/model/StepStatusEnum';

const initialState: FlowModel = {
  steps: [],
};

export const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setSteps: (state, action: PayloadAction<StepModel[]>) => {
      state.steps = action.payload;
    },
    setTitle: (
      state,
      action: PayloadAction<{
        name: string;
        text: string;
        boldWords: string[];
      }>,
    ) => {
      const stepsUpdated = state.steps.map(step => {
        if (step.name !== action.payload.name) {
          return step;
        }

        step.title = action.payload;
        return step;
      });

      state.steps = stepsUpdated;
    },
    setInfoText: (
      state,
      action: PayloadAction<{ name: string; text: string }>,
    ) => {
      const stepsUpdated = state.steps.map(step => {
        if (step.name !== action.payload.name) {
          return step;
        }

        step.infoText = action.payload.text;
        return step;
      });

      state.steps = stepsUpdated;
    },
    advanceStep: state => {
      const stepsUpdated = state.steps;
      const currentStepIndex = state.steps.findIndex(
        step => step.status === StepStatusEnum.EDITABLE,
      );
      const nextStepIndex = currentStepIndex + 1;

      if (currentStepIndex === -1) return;
      stepsUpdated[currentStepIndex] = {
        ...stepsUpdated[currentStepIndex],
        status: StepStatusEnum.FINISHED,
      };

      if (state.steps.length <= nextStepIndex) {
        state.steps = stepsUpdated;
        return;
      }
      stepsUpdated[nextStepIndex] = {
        ...stepsUpdated[nextStepIndex],
        status: StepStatusEnum.EDITABLE,
      };

      state.steps = stepsUpdated;
    },
    setEditableStep: (state, action: PayloadAction<string>) => {
      const currentStepIndex = state.steps.findIndex(
        step => step.name === action.payload,
      );
      state.steps = state.steps.map((step, index) => {
        if (index > currentStepIndex) {
          step.status = StepStatusEnum.HIDDEN;
          return step;
        }

        if (index < currentStepIndex) {
          step.status = StepStatusEnum.FINISHED;
          return step;
        }

        step.status = StepStatusEnum.EDITABLE;
        return step;
      });
    },
    updateSteps: (state, action: PayloadAction<StepModel | StepModel[]>) => {
      if (Array.isArray(action.payload)) {
        state.steps = state.steps.concat(action.payload);
      } else {
        state.steps.push(action.payload);
      }
    },
  },
});

export const selectFlow = (state: RootState) => state.flow;

export const { actions: flowActions } = flowSlice;

export default flowSlice.reducer;
