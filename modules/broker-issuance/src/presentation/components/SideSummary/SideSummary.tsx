import { FunctionComponent, useState } from 'react';
import className from 'classnames';
import { nanoid } from '@reduxjs/toolkit';
import { LinkButton } from 'junto-design-system';
import { StepStatusEnum, useFlow } from '@shared/hooks';
import styles from './SideSummary.module.scss';

const SideSummary: FunctionComponent = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const { steps, setEditableStep } = useFlow();

  const handleSetEditableStep = (componentName: string) => {
    setEditableStep(componentName);
  };

  const handleTouchStart = (e: any) => {
    e.stopPropagation();
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: any) => {
    e.stopPropagation();
    const { clientY } = e.changedTouches[0];
    if (touchStartY > clientY + 5) setMobileOpen(true);
    if (touchStartY < clientY + 5) setMobileOpen(false);
  };

  const renderSummarySteps = () => {
    return steps.map((step, index) => {
      return (
        <li
          key={nanoid(5)}
          className={className(styles['side-summary__list-step-item'], {
            [styles['side-summary__list-step-item--editable']]:
              step.status === StepStatusEnum.EDITABLE,
          })}
        >
          <span
            className={className(
              styles['side-summary__step-identification'],
              {
                [styles['side-summary__step-identification--disabled']]:
                  step.status === StepStatusEnum.HIDDEN,
              },
              {
                [styles['side-summary__step-identification--finished']]:
                  step.status === StepStatusEnum.FINISHED,
              },
            )}
          >
            {renderIdentificationStep(step.status, index)}
          </span>
          <p
            className={className(styles['side-summary__step-text'], {
              [styles['side-summary__step-text--disabled']]:
                step.status === StepStatusEnum.HIDDEN,
            })}
          >
            {step.summaryTitle}
            {step.status === StepStatusEnum.FINISHED && (
              <LinkButton
                id={`sideSummary-editStep-link-button-${step.name}`}
                data-testid={`sideSummary-editStep-link-button-${step.name}`}
                onClick={() => handleSetEditableStep(step.name)}
                label="Editar"
              />
            )}
          </p>
        </li>
      );
    });
  };

  const renderIdentificationStep = (status: StepStatusEnum, index: number) => {
    if (status === StepStatusEnum.FINISHED) {
      return <i className={className('icon', 'icon-check')} />;
    }

    return index + 1;
  };

  return (
    <aside
      id="sideSummary-container-aside"
      data-testid="sideSummary-container-aside"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={className(styles['side-summary__wrapper'], {
        [styles['side-summary__wrapper--open']]: mobileOpen,
      })}
    >
      <h2 className={styles['side-summary__title']}>Resumo</h2>
      <div className={styles['side-summary__mobile-indicator']} />
      <ul className={styles['side-summary__list-steps']}>
        {renderSummarySteps()}
      </ul>
    </aside>
  );
};

export default SideSummary;
