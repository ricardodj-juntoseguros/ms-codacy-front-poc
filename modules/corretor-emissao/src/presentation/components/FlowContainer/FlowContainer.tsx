import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSteps } from '../../../application/features/flow/FlowSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { SearchContainer } from '../searchContainer';
import { defaultStep, modalities } from '../../../constants';
import {
  ModalityModel,
  ModalityTypeEnum,
} from '../../../application/types/model';
import { getModalityType } from '../../../helpers';

export function FlowContainer() {
  const [currentModalityType, setCurrentModalityType] =
    useState<ModalityTypeEnum | null>(null);

  const { modality } = useSelector(selectQuote);
  const dispatch = useDispatch();

  const createFlow = useCallback((modality: ModalityModel | null) => {
    const mountFlow = (type: ModalityTypeEnum) => {
      const nextSteps = modalities[type].steps.map(item => ({
        name: item.name,
        number: item.number,
        isActive: item.isActive,
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
      if (modalityType) {
        setCurrentModalityType(modalityType);
        return mountFlow(modalityType);
      }
    }

    return [defaultStep];
  }, []);

  useEffect(() => {
    dispatch(setSteps(createFlow(modality)));
  }, [dispatch, createFlow, modality]);

  return (
    <>
      <SearchContainer />
      {modality && currentModalityType && (
        <>
          {modalities[currentModalityType].steps.map(
            ({ Component, number }) => (
              <Component key={number} />
            ),
          )}
        </>
      )}
    </>
  );
}
