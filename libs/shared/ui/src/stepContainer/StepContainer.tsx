import { useContext, useMemo } from 'react';
import { LinkButton, ThemeContext } from 'junto-design-system';
import className from 'classnames';
import { nanoid } from '@reduxjs/toolkit';
import { StepContainerProps, StepStatusEnum, useFlow } from '@shared/hooks';
import styles from './StepContainer.module.scss';

export const StepContainer: React.FC<StepContainerProps> = ({
  name,
  status,
  index,
  title,
  infoText,
  children,
}) => {
  const theme = useContext(ThemeContext);
  const { setEditableStep } = useFlow();
  const stepTitle = useMemo(() => {
    let boldWordsIndex = 0;
    return title.text.split(' ').map((item: any) => {
      if (item === '%STRONG%' && title.boldWords) {
        const updatedText = (
          <strong
            key={nanoid(5)}
            className={styles[theme]}
          >{`${title.boldWords[boldWordsIndex]} `}</strong>
        );
        boldWordsIndex += 1;
        return updatedText;
      }

      return `${item} `;
    });
  }, [theme, title]);

  const renderIdentificationStep = () => {
    if (status === StepStatusEnum.FINISHED) {
      return (
        <i
          data-testid="stepContainer-identification-check"
          className={className('icon', 'icon-check', styles[theme])}
        />
      );
    }

    return index + 1;
  };

  const renderFinishContent = () => {
    return (
      <div
        data-testid={`stepContainer-finishContent-${index}`}
        className={styles['step-container__info-wrapper']}
      >
        <p
          className={className(
            styles['step-container__info-text'],
            styles[theme],
          )}
        >
          {infoText}
        </p>
        <LinkButton
          data-testid="stepContainer-button-edit"
          label="Editar"
          onClick={() => setEditableStep(name)}
        />
      </div>
    );
  };

  return (
    <div
      data-testid={`stepContainer-wrapper-${index}`}
      className={styles['step-container__wrapper']}
    >
      <header className={styles['step-container__header']}>
        <span
          data-testid={`stepContainer-identification-${index}`}
          className={className(
            styles['step-container__number'],
            {
              [styles['step-container__number--finished']]:
                status === StepStatusEnum.FINISHED,
            },
            styles[theme],
          )}
        >
          {renderIdentificationStep()}
        </span>
        <h2
          className={className(
            styles['step-container__title'],
            {
              [styles['step-container__title--finished']]:
                status === StepStatusEnum.FINISHED,
            },
            styles[theme],
          )}
        >
          {stepTitle}
        </h2>
      </header>
      {status === StepStatusEnum.FINISHED ? renderFinishContent() : children}
    </div>
  );
};
