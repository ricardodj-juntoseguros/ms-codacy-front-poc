import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StepContainer } from '@libs/shared/ui';
import { searchPolicyHolder } from '../../../application/features/policyholderAndModalitySearch/thunks/SearchPolicyholderThunk';
import { getModalityByPolicyHolder } from '../../../application/features/policyholderAndModalitySearch/thunks/GetModalityByPolicyholderThunk';
import { getSubsidiaryByPolicyHolder } from '../../../application/features/policyholderAndModalitySearch/thunks/GetSubsidiaryByPolicyholderThunk';
import { PolicyholderAndModalitySearch } from '../../components/policyholderAndModalitySearch';
import {
  selectPolicyholderAndModalitySearch,
  resetSearch,
  setPolicyholder,
  setModality,
  setSubsidiary,
} from '../../../application/features/policyholderAndModalitySearch/PolicyholderAndModalitySearchSlice';
import {
  PolicyholderModel,
  ModalityModel,
  SubsidiaryModel,
} from '../../../application/types/model';

export function SearchContainer() {
  const dispatch = useDispatch();
  const {
    policyholder,
    policyholderOptions,
    loadingSearchPolicyholder,
    modalityOptions,
    loadingGetModalities,
    subsidiaryOptions,
  } = useSelector(selectPolicyholderAndModalitySearch);

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (searchValue !== '' && searchValue.length > 3) {
      dispatch(searchPolicyHolder(searchValue));
    }
  }, [dispatch, searchValue]);

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

  return (
    <div>
      <StepContainer stepNumber={1} title={StepTitle()} active>
        <PolicyholderAndModalitySearch
          searchValue={searchValue}
          onChangeSearchValue={setSearchValue}
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
          onChangeModalityValue={handleModalitySelection}
          subsidiaryOptions={subsidiaryOptions}
          onChangeSubsidiaryValue={handleSubsidiarySelection}
        />
      </StepContainer>
    </div>
  );
}
