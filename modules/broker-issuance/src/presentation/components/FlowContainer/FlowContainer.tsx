import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { flowSliceActions } from '../../../application/features/flow/FlowSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { defaultStep, modalities } from '../../../constants';
import {
  ModalityModel,
  StepModel,
  ModalitiesGroupEnum,
} from '../../../application/types/model';
import { getModalityByGroup, getModalityType } from '../../../helpers';
import { Search } from '../Search';

export function FlowContainer() {
  const [currentGroupModality, setCurrentGroupModality] =
    useState<ModalitiesGroupEnum | null>(null);

  const { modality } = useSelector(selectQuote);
  const dispatch = useDispatch();

  const createFlow = useCallback((modality: ModalityModel | null) => {
    const mountFlow = (type: ModalitiesGroupEnum) => {
      const nextSteps: StepModel[] = modalities[type].steps.map(item => ({
        name: item.name,
        number: item.number,
        isActive: item.isActive,
        isVisible: item.isVisible,
        isEnabled: item.isEnabled,
        isLoading: item.isLoading,
        isCompleted: item.isCompleted,
        nextStep: item.nextStep,
      }));

      if (nextSteps) {
        const initialStep = { ...defaultStep, nextStep: nextSteps[0].name };
        const flowCreated = [initialStep, ...nextSteps];
        return flowCreated;
      }

      return [defaultStep];
    };

    if (modality) {
      const modalityType = getModalityType(modality.id);
      const groupModality = getModalityByGroup(modalityType);
      setCurrentGroupModality(groupModality);

      return mountFlow(groupModality);
    }

    setCurrentGroupModality(ModalitiesGroupEnum.DEFAULT);
    return mountFlow(ModalitiesGroupEnum.DEFAULT);
  }, []);

  useEffect(() => {
    dispatch(flowSliceActions.setSteps(createFlow(modality)));
  }, [dispatch, createFlow, modality]);

  return (
    <>
      <Search />
      {currentGroupModality && (
        <>
          {modalities[currentGroupModality].steps.map(
            ({ Component, number }) => (
              <Component key={number} />
            ),
          )}
        </>
      )}
    </>
  );
}
