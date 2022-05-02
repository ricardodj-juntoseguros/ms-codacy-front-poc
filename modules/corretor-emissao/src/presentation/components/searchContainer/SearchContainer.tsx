import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StepContainer } from '@shared/ui';
import { getStepByName } from '../../../helpers';
import { policyholderAndModalitySearchThunks } from '../../../application/features/policyholderAndModalitySearch/thunks';
import { PolicyholderAndModalitySearch } from '../../components/policyholderAndModalitySearch';
import {
  selectPolicyholderAndModalitySearch,
  policyholderAndModalitySearchSliceActions,
} from '../../../application/features/policyholderAndModalitySearch/PolicyholderAndModalitySearchSlice';
import {
  selectQuote,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import {
  selectFlow,
  flowSliceActions,
} from '../../../application/features/flow/FlowSlice';
import {
  PolicyholderModel,
  ModalityModel,
  SubsidiaryModel,
} from '../../../application/types/model';

const stepName = 'SearchContainer';

export function SearchContainer() {
  const [policyholderInput, setPolicyholderInput] = useState('');

  const dispatch = useDispatch();
  const {
    policyholderOptions,
    loadingSearchPolicyholder,
    modalityOptions,
    loadingGetModalities,
    subsidiaryOptions,
  } = useSelector(selectPolicyholderAndModalitySearch);
  const { policyholder, modality, subsidiary } = useSelector(selectQuote);
  const { steps } = useSelector(selectFlow);

  const stepStatus = useMemo(() => {
    return getStepByName(stepName, steps);
  }, [steps]);

  function handleChangePolicyholderInput(value: string) {
    setPolicyholderInput(value);

    // if (value !== '') {
    //   // dispatch(policyholderAndModalitySearchThunks.searchPolicyHolder(value));
    // }
  }

  function StepTitle() {
    return (
      <title>
        Digite o <strong>CNPJ</strong> ou a <strong>razão social </strong>
        do tomador e selecione a <strong>modalidade</strong> do seguro
      </title>
    );
  }

  function handlePolicyholderSelection(data: PolicyholderModel) {
    const { federalId, id } = data;
    dispatch(policyholderAndModalitySearchSliceActions.resetSearch());
    dispatch(quoteSliceActions.setPolicyholder(data));
    dispatch(
      policyholderAndModalitySearchThunks.getModalityByPolicyHolder(federalId),
    );
    dispatch(
      policyholderAndModalitySearchThunks.getSubsidiaryByPolicyHolder(id),
    );
  }

  function handleModalitySelection(data: ModalityModel) {
    dispatch(quoteSliceActions.setModality(data));
  }

  function handleSubsidiarySelection(data: SubsidiaryModel) {
    dispatch(quoteSliceActions.setSubsidiary(data));
  }

  useEffect(() => {
    if (policyholder && modality && stepStatus) {
      dispatch(flowSliceActions.advanceStep({ name: stepName }));
      dispatch(
        flowSliceActions.setStepStatus({
          name: stepStatus.nextStep,
          isEnabled: true,
          isLoading: false,
          isVisible: true,
        }),
      );
    }
  }, [dispatch, modality, policyholder, stepStatus]);

  useEffect(() => {
    if (policyholder) {
      setPolicyholderInput(policyholder.companyName);
    }
  }, [policyholder]);

  return (
    <div>
      <StepContainer
        stepNumber={stepStatus?.number}
        title={StepTitle()}
        isEnabled
      >
        <PolicyholderAndModalitySearch
          policyholderInput={policyholderInput}
          onChangePolicyholderInput={handleChangePolicyholderInput}
          onSelectPolicyholder={handlePolicyholderSelection}
          policyholderOptions={policyholderOptions}
          hasValidPolicyholder={
            !!policyholder &&
            !loadingSearchPolicyholder &&
            !loadingGetModalities
          }
          handlePolicyholderDetails={() =>
            console.log('handlePolicyholderDetails')
          }
          modalityOptions={modalityOptions}
          onSelectModality={handleModalitySelection}
          modality={modality}
          subsidiaryOptions={subsidiaryOptions}
          onSelectSubsidiary={handleSubsidiarySelection}
          subsidiary={subsidiary}
        />
      </StepContainer>
    </div>
  );
}
