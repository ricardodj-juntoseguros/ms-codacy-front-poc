import { FunctionComponent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LinkButton } from 'junto-design-system';
import classNames from 'classnames';
import { StepStatusEnum, useFlow } from '@shared/hooks';
import { useFormSummary } from '../../hooks';
import styles from './SideSummary.module.scss';

const SideSummary: FunctionComponent = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [stepsExpandedDetails, setStepsExpandedDetails] = useState<string[]>(
    [],
  );
  const { steps, setEditableStep } = useFlow();
  const { getSummaryData, uploadedDocumentsSummary } = useFormSummary();

  useEffect(() => {
    const editableStep = steps.find(
      step => step.status === StepStatusEnum.EDITABLE,
    );
    if (editableStep) {
      setStepsExpandedDetails([editableStep.name]);
    }
  }, [steps]);

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
    if (touchStartY > clientY + 5) setMobileDrawerOpen(true);
    if (touchStartY < clientY + 5) setMobileDrawerOpen(false);
  };

  const handleToggleDetailsClick = (name: string, isExpanded: boolean) => {
    setStepsExpandedDetails(prevStepsExpandedDetails => {
      return isExpanded
        ? prevStepsExpandedDetails.filter(stepName => stepName !== name)
        : [...prevStepsExpandedDetails, name];
    });
  };

  const renderStepDetails = (stepName: string) => {
    const data = getSummaryData(stepName);
    return (
      <motion.div
        initial={{ maxHeight: 0 }}
        animate={{ maxHeight: 250 }}
        exit={{ maxHeight: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={styles['side-summary__step-details']}
      >
        {data.map(({ key, label, value }) => (
          <div
            key={`summary-details-${key}`}
            className={styles['side-summary__step-details-row']}
          >
            <span>{label}</span>
            <span title={value}>{value}</span>
          </div>
        ))}
      </motion.div>
    );
  };

  const renderSummarySteps = () => {
    const renderStepIdentification = (
      status: StepStatusEnum,
      index: number,
    ) => {
      return status === StepStatusEnum.FINISHED ? (
        <i className={classNames('icon', 'icon-check')} />
      ) : (
        index + 1
      );
    };

    return steps.map(({ name, status, summaryTitle }, index) => {
      const isEditable = status === StepStatusEnum.EDITABLE;
      const isHidden = status === StepStatusEnum.HIDDEN;
      const isFinished = status === StepStatusEnum.FINISHED;
      const isExpanded = stepsExpandedDetails.includes(name);

      return (
        <li
          key={`side-summary-step-item-${name}`}
          className={classNames(styles['side-summary__list-step-item'], {
            [styles['side-summary__list-step-item--editable']]: isEditable,
          })}
        >
          <div
            className={classNames(styles['side-summary__list-item-header'], {
              [styles['side-summary__list-item-header--details-expanded']]:
                isExpanded,
            })}
          >
            <div>
              <span
                className={classNames(
                  styles['side-summary__step-identification'],
                  {
                    [styles['side-summary__step-identification--disabled']]:
                      isHidden,
                  },
                  {
                    [styles['side-summary__step-identification--finished']]:
                      isFinished,
                  },
                )}
              >
                {renderStepIdentification(status, index)}
              </span>
              <p
                className={classNames(styles['side-summary__step-text'], {
                  [styles['side-summary__step-text--disabled']]: isHidden,
                })}
              >
                {summaryTitle}
                {isFinished && (
                  <LinkButton
                    id={`sideSummary-editStep-link-button-${name}`}
                    data-testid={`sideSummary-editStep-link-button-${name}`}
                    onClick={() => handleSetEditableStep(name)}
                    label="Editar"
                  />
                )}
              </p>
            </div>
            {!isHidden && (
              <LinkButton
                id={`sideSummary-toggle-details-button-${name}`}
                data-testid={`sideSummary-toggle-details-button-${name}`}
                icon="chevron-down"
                onClick={() => handleToggleDetailsClick(name, isExpanded)}
                label=""
                title={isExpanded ? 'Recolher' : 'Expandir'}
              />
            )}
          </div>
          <AnimatePresence>
            {isExpanded && renderStepDetails(name)}
          </AnimatePresence>
        </li>
      );
    });
  };

  const renderUploadedDocuments = () => {
    if (uploadedDocumentsSummary.length === 0) return null;
    return (
      <li className={styles['side-summary__uploaded-documents']}>
        <p>Documentos enviados</p>
        <div className={styles['side-summary__uploaded-documents-list']}>
          {uploadedDocumentsSummary.map(({ filename, size }) => (
            <div
              className={styles['side-summary__uploaded-documents-listitem']}
            >
              <i className="icon-file" />
              <div>
                <p>{filename}</p>
                <span>{size}</span>
              </div>
            </div>
          ))}
        </div>
      </li>
    );
  };

  return (
    <aside
      id="sideSummary-container-aside"
      data-testid="sideSummary-container-aside"
      className={classNames(styles['side-summary__wrapper'], {
        [styles['side-summary__wrapper--open']]: mobileDrawerOpen,
      })}
    >
      <h2 className={styles['side-summary__title']}>Resumo</h2>
      <div
        id="sideSummary-mobile-drawer"
        data-testid="sideSummary-mobile-drawer"
        className={styles['side-summary__mobile-drawer']}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles['side-summary__mobile-indicator']} />
      </div>
      <ul className={styles['side-summary__list-steps']}>
        {renderSummarySteps()}
        {renderUploadedDocuments()}
      </ul>
    </aside>
  );
};

export default SideSummary;
