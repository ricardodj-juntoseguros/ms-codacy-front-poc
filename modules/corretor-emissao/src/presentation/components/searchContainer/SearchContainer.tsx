import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StepContainer } from '@shared/ui';
import { getStepByName } from '../../../helpers';
import { searchPolicyHolder } from '../../../application/features/policyholderAndModalitySearch/thunks/SearchPolicyholderThunk';
import { getModalityByPolicyHolder } from '../../../application/features/policyholderAndModalitySearch/thunks/GetModalityByPolicyholderThunk';
import { getSubsidiaryByPolicyHolder } from '../../../application/features/policyholderAndModalitySearch/thunks/GetSubsidiaryByPolicyholderThunk';
import { PolicyholderAndModalitySearch } from '../../components/policyholderAndModalitySearch';
import {
  selectPolicyholderAndModalitySearch,
  resetSearch,
} from '../../../application/features/policyholderAndModalitySearch/PolicyholderAndModalitySearchSlice';
import {
  setPolicyholder,
  setModality,
  setSubsidiary,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import {
  selectFlow,
  advanceStep,
  setStepStatus,
} from '../../../application/features/flow/FlowSlice';
import {
  PolicyholderModel,
  ModalityModel,
  SubsidiaryModel,
} from '../../../application/types/model';

const stepName = 'SearchContainer';

export function SearchContainer() {
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

  const [policyholderInput, setPolicyholderInput] = useState('');

  const stepStatus = useMemo(() => {
    return getStepByName(stepName, steps);
  }, [steps]);

  function handleChangePolicyholderInput(value: string) {
    setPolicyholderInput(value);
    if (value !== '') {
      dispatch(searchPolicyHolder(value));
    }
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
    dispatch(resetSearch());
    dispatch(setPolicyholder(data));
    dispatch(getModalityByPolicyHolder(federalId));
    dispatch(getSubsidiaryByPolicyHolder(id));
  }

  function handleModalitySelection(data: ModalityModel) {
    dispatch(setModality(data));
  }

  function handleSubsidiarySelection(data: SubsidiaryModel) {
    dispatch(setSubsidiary(data));
  }

  useEffect(() => {
    if (policyholder && modality && stepStatus) {
      dispatch(advanceStep({ name: stepName }));
      dispatch(
        setStepStatus({
          name: stepStatus.nextStep,
          isEnabled: true,
          isLoading: false,
          isVisible: true,
        }),
      );
    }
  }, [dispatch, modality, policyholder, stepStatus]);

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
