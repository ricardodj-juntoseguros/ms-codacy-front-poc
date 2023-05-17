import { useContext, useMemo } from "react";
import { LinkButton, ThemeContext } from "junto-design-system";
import className from 'classnames';
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { flowActions } from "../../../application/features/flow/FlowSlice";
import { StepStatusEnum } from "../../../application/types/model";
import { ALL_PROPOSAL_STEPS } from "../../../constants";
import styles from './StepContainer.module.scss';

export interface StepContainerProps {
  name:  string;
  status: string;
  index: number;
  title: {
    text: string;
    boldWords: string[];
  },
  infoText?: string;
}

const StepContainer: React.FC<StepContainerProps> = ({ name, status, index, title, infoText }) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const stepTitle = useMemo(() => {
    let boldWordsIndex = 0;

    return title.text.split(' ').map(item => {
      if (item === '%STRONG%' && title.boldWords) {
        const updatedText = <strong key={nanoid(5)} className={styles[theme]}>{`${title.boldWords[boldWordsIndex]} `}</strong>;
        boldWordsIndex += 1;
        return updatedText;
      }

      return `${item} `;
    });
  }, [theme, title]);

  const renderComponent = () => {
    const step = ALL_PROPOSAL_STEPS.find(step => step.name === name);
    if (!step || !step.component) return null;

    return <step.component handleNextStep={handleNextStep} />;
  };

  const renderIdentificationStep = () => {
    if (status === StepStatusEnum.FINISHED) {
      return (
        <i
        data-testid="stepContainer-identification-check"
        className={className(
          'icon',
          'icon-check',
          styles[theme]
        )} />
      )
    }

    return index + 1;
  }

  const renderFinishContent = () => {
    return (
      <div data-testid={`stepContainer-finishContent-${index}`} className={styles['step-container__info-wrapper']}>
        <p className={className(
          styles['step-container__info-text'],
          styles[theme]
        )}>
          {infoText}
        </p>
        <LinkButton
          data-testid="stepContainer-button-edit"
          label="Editar"
          onClick={() => handleEditableStep()}
        />
      </div>
    )
  }

  const handleNextStep = (text = '') => {
  dispatch(flowActions.setInfoText({name, text}));
    dispatch(flowActions.advanceStep())
  };

  const handleEditableStep = () => {
    dispatch(flowActions.setEditableStep(name));
  }

  return (
    <div data-testid={`stepContainer-wrapper-${index}`} className={styles['step-container__wrapper']}>
      <span data-testid={`stepContainer-identification-${index}`} className={className(
        styles['step-container__number'],
        { [styles['step-container__number--finished']]: status === StepStatusEnum.FINISHED },
        styles[theme]
        )}>
        {renderIdentificationStep()}
      </span>
      <h2 className={className(
        styles['step-container__title'],
        { [styles['step-container__title--finished']]: status === StepStatusEnum.FINISHED },
        styles[theme]
      )}>
        {stepTitle}
      </h2>
      {status === StepStatusEnum.EDITABLE ? renderComponent() : renderFinishContent()}
    </div>
  )
}

export default StepContainer;
