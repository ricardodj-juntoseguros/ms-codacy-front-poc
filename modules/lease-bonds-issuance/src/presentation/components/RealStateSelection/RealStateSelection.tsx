import React, {
  FunctionComponent,
  useState,
} from 'react';
import {
  SearchInput,
  SearchOptions,
  makeToast,
} from 'junto-design-system';
import { useDebounce } from '@shared/hooks';
import RealStateSelectionApi from '../../../application/features/realStateSelection/RealStateSelectionApi';

const RealStateSelection: FunctionComponent = () => {
  const [showEmptyOptions, setShowEmptyOptions] = useState(false);
  const [loadingSearchRealState, setLoadingSearchRealState] = useState(false);
  const [realStateOptions, setRealStateOptions] = useState<SearchOptions[]>([])
  const [realStateSearchValue, setRealStateSearchValue] = useState<string>('')

  const searchRealState = (search: string) => {
    RealStateSelectionApi.searchRealState(search).then(result => {
      setShowEmptyOptions(false)
      setLoadingSearchRealState(true)
      if (!result.records?.length) {
        setShowEmptyOptions(true)
        setLoadingSearchRealState(false)
        return
      }
      setRealStateOptions(result.records.map(item => ({
        companyName: item.name,
        federalId: item.federalId,
        id: item.id,
        label: item.name,
        value: String(item.id),
      })))
      setLoadingSearchRealState(false)
    }).catch(() => {
      makeToast('error', 'Houve um erro ao buscar os dados do estipulante');
    })
  }

  useDebounce(
    () => realStateSearchValue && searchRealState(realStateSearchValue),
    1000,
    [realStateSearchValue],
  );

  const handleSearchRealState = (search: string) => {
    setRealStateSearchValue(search)
  };

  const handleRealStateSelected = async (optionSelected: SearchOptions) => {
    console.log('selected', optionSelected)
  };

  return (
    <SearchInput
      id="real-state-selection-input-search"
      data-testid="real-state-selection-input-search"
      label="CNPJ ou Razão Social do estipulante/imobiliária"
      placeholder="CNPJ ou Razão Social do estipulante/imobiliária"
      onChange={handleSearchRealState}
      changeValueOnSelect
      value={realStateSearchValue}
      options={realStateOptions}
      onValueSelected={handleRealStateSelected}
      emptyMessage="estipulante/imobiliária não encontrado..."
      showEmptyOptions={showEmptyOptions}
      loading={loadingSearchRealState}
      autoComplete="off"
      readOnly={false}
    />
  );
};

export default RealStateSelection;
