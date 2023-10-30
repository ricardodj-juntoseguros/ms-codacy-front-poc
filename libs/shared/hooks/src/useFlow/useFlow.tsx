import {
  useState,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from 'react';
import { nanoid } from 'nanoid/non-secure';

import { StepContainer } from '@shared/ui';
import {
  FlowContextProps,
  FlowProviderProps,
  StepComponentModel,
  StepModel,
} from './types';
import { StepStatusEnum } from './enums';

const FlowContext = createContext<FlowContextProps>({} as FlowContextProps);

const FlowProvider: React.FC<FlowProviderProps> = ({
  initialSteps,
  allSteps,
  showFinishedSteps = true,
  ComponentContainer = StepContainer,
  children,
}) => {
  const [currentSteps, setCurrentSteps] = useState<StepModel[]>(initialSteps);

  const setSteps = (steps: StepComponentModel[]) => {
    setCurrentSteps(prevState => prevState.concat(steps));
  };

  const setTitle = (stepName: string, text: string, boldWords: string[]) => {
    setCurrentSteps(prevState =>
      prevState.map(step => {
        if (step.name === stepName) {
          step.title = { text, boldWords };
          return step;
        }
        return step;
      }),
    );
  };

  const setInfoText = (stepName: string, text: string) => {
    setCurrentSteps(prevState =>
      prevState.map(step => {
        if (step.name === stepName) {
          step.infoText = text;
          return step;
        }
        return step;
      }),
    );
  };

  const advanceStep = (stepName: string, infoText?: string) => {
    let nextStepIndex = -1;
    setCurrentSteps(prevState =>
      prevState.map((step, index) => {
        if (step.name === stepName) {
          step.status = StepStatusEnum.FINISHED;
          nextStepIndex = index + 1;
          return step;
        }
        if (
          index === nextStepIndex &&
          currentSteps.length >= nextStepIndex + 1
        ) {
          step.status = StepStatusEnum.EDITABLE;
        }
        return step;
      }),
    );
    if (infoText) setInfoText(stepName, infoText);
  };

  const setEditableStep = (stepName: string) => {
    const currentStepIndex = currentSteps.findIndex(
      step => step.name === stepName,
    );
    if (currentStepIndex === -1) return;
    setCurrentSteps(
      currentSteps.map((step, index) => {
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
      }),
    );
  };

  const getComponent = useCallback(
    (name: string) => {
      return allSteps.find(step => step.name === name)?.component;
    },
    [allSteps],
  );

  const renderSteps = useMemo(() => {
    return currentSteps.map((step, index) => {
      const Component = getComponent(step.name);
      if (
        !Component ||
        step.status === StepStatusEnum.HIDDEN ||
        (!showFinishedSteps && step.status === StepStatusEnum.FINISHED)
      ) {
        return null;
      }
      return (
        <ComponentContainer key={nanoid(5)} index={index} {...step}>
          <Component name={step.name} />
        </ComponentContainer>
      );
    });
  }, [ComponentContainer, currentSteps, getComponent, showFinishedSteps]);

  return (
    <FlowContext.Provider
      value={{
        steps: currentSteps,
        advanceStep,
        setEditableStep,
        setInfoText,
        setSteps,
        setTitle,
      }}
    >
      {children}
      {currentSteps && renderSteps}
    </FlowContext.Provider>
  );
};

function useFlow(): FlowContextProps {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be use whithin FlowProvider');
  }
  return context;
}

export { FlowProvider, useFlow };
