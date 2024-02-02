import {
  useState,
  useContext,
  createContext,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { StepContainer } from '@shared/ui';
import { FlowContextProps, FlowProviderProps, StepModel } from './types';
import { StepStatusEnum } from './enums';
import { getStepList } from './utils';

const FlowContext = createContext<FlowContextProps>({} as FlowContextProps);

const FlowProvider: React.FC<FlowProviderProps> = ({
  initialSteps,
  allSteps,
  showFinishedSteps = true,
  ComponentContainer = StepContainer,
  children,
  wrapperRef,
}) => {
  const stepRef = useRef<HTMLDivElement>(null);
  const [currentSteps, setCurrentSteps] = useState<StepModel[]>(
    getStepList(initialSteps),
  );

  const setSteps = (steps: StepModel[]) => {
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

    // UX request - if there is only one step on screen,
    // scroll to top of wrapper if user scrolled a third of step
    if (wrapperRef && wrapperRef.current && stepRef && stepRef.current) {
      const wrapperScroll = wrapperRef.current.scrollTop;
      const stepY = stepRef.current.offsetTop;
      const stepHeight = stepRef.current.clientHeight;
      if (wrapperScroll > stepY + stepHeight / 3) {
        wrapperRef.current.scrollTo({ behavior: 'smooth', top: 0 });
      }
    }
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
        <div
          key={`step-${step.name}`}
          ref={!showFinishedSteps ? stepRef : undefined}
        >
          <ComponentContainer index={index} {...step}>
            <Component name={step.name} />
          </ComponentContainer>
        </div>
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
