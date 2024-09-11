import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { VendorsHeader } from '@shared/ui';
import { StepStatusEnum } from '../../../application/types/model';
import styles from './FlowContainer.module.scss';
import {
  flowActions,
  selectFlow,
} from '../../../application/features/flow/FlowSlice';
import { COMMON_PROPOSAL_STEPS, REDIRECT_URLS } from '../../../constants';
import StepContainer from '../../components/StepContainer/StepContainer';
import { getStepList } from '../../../helpers';
import { AppDispatch } from '../../../config/store';

function FlowContainer() {
  const dispatch: AppDispatch = useDispatch();
  const { steps } = useSelector(selectFlow);

  useEffect(() => {
    if (steps.length === 0) {
      dispatch(flowActions.setSteps(getStepList(COMMON_PROPOSAL_STEPS)));
    }
  }, [dispatch, steps]);

  const renderSteps = () => {
    return steps.map((step, index) => {
      if (step.status === StepStatusEnum.HIDDEN) {
        return null;
      }
      return <StepContainer key={nanoid(5)} index={index} {...step} />;
    });
  };

  return (
    <>
      <VendorsHeader
        showMenuItems={false}
        backButton={() => window.location.assign(REDIRECT_URLS.policies)}
      />
      <section className={styles['flow-container__wrapper']}>
        {renderSteps()}
      </section>
    </>
  );
}

export default FlowContainer;
