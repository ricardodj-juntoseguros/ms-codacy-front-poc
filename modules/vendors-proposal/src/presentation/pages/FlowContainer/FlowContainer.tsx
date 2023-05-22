import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { FileProvider } from '../../../config/filesContext';
import { StepStatusEnum } from '../../../application/types/model';
import styles from './FlowContainer.module.scss';
import { flowActions, selectFlow } from '../../../application/features/flow/FlowSlice';
import { COMMON_PROPOSAL_STEPS } from '../../../constants';
import StepContainer from '../../components/StepContainer/StepContainer';
import { getStepList } from '../../../helpers';

function FlowContainer() {
  const dispatch = useDispatch();
  const { steps } = useSelector(selectFlow);

  useEffect(() => {
    dispatch(flowActions.setSteps(getStepList(COMMON_PROPOSAL_STEPS)));
  }, [dispatch]);

  const renderSteps = () => {
    return steps.map((step, index) => {
      if(step.status === StepStatusEnum.HIDDEN) {
        return null;
      }
      return (
        <StepContainer key={nanoid(5)} index={index} {...step}/>
      )
    });
  };

  return (
    <FileProvider>
      <section className={styles['flow-container__wrapper']}>
        {renderSteps()}
      </section>
    </FileProvider>
  );
}

export default FlowContainer;
