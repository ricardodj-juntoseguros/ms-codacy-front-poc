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
import { BrokerPlatformAuthService } from '@services';
import RealStateSelectionApi from '../../../application/features/realStateSelection/RealStateSelectionApi';
import { RealStateSearchDTO } from '../../../application/types/dto';

const RealStateSelection: FunctionComponent = () => {
  const [showEmptyOptions, setShowEmptyOptions] = useState(false);
  const [loadingSearchRealState, setLoadingSearchRealState] = useState(false);
  const [realStateOptions, setRealStateOptions] = useState<SearchOptions[]>([])
  const [realStateSearchValue, setRealStateSearchValue] = useState<string>('')

  const searchRealState = (search: string) => {
    const broker = BrokerPlatformAuthService.getBroker();
    if (!broker || !broker?.federalId) {
      makeToast('error', 'Houve um erro ao buscar os dados do estipulante');
      return;
    }

    RealStateSelectionApi.searchRealState(broker?.federalId, search).then((result: RealStateSearchDTO) => {
      setShowEmptyOptions(false)
      setLoadingSearchRealState(true)
      if (!result) {
        setShowEmptyOptions(true)
        setLoadingSearchRealState(false)
        return
      }
      const label = `${result.federalId.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5")} - ${result.businessName}`;
      const value = result.federalId;
      setRealStateOptions([{
        label,
        value,
      }])
      setLoadingSearchRealState(false)
    }).catch((error) => {
      const defaultMessage = 'Houve um erro ao buscar os dados do estipulante';
      if (error?.data?.data[0]?.code === 'UNDEFINED_0') {
        makeToast('error', defaultMessage);
        return;
      }
      const msg = error?.data?.data?.length ? (error.data.data[0]?.message ?? defaultMessage) : defaultMessage;
      makeToast('error', msg);
    })
  }

  useDebounce(
    () => realStateSearchValue && searchRealState(realStateSearchValue),
    1000,
    [realStateSearchValue],
  );

  const handleSearchRealState = (search: string) => {
    if (realStateOptions.some(item => item.label === search)) return;
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
