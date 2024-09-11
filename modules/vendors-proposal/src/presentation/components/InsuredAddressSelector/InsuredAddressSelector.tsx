import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dropdown,
  DropdownOptions,
  InputBase,
  makeToast,
} from 'junto-design-system';
import { stringToInt } from '@shared/utils';
import {
  selectProposal,
  proposalActions,
} from '../../../application/features/proposal/ProposalSlice';
import { InsuredAddressDTO } from '../../../application/types/dto';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';
import { AppDispatch } from '../../../config/store';
import styles from './InsuredAddressSelector.module.scss';

const InsuredAddressSelector: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { insuredFederalId, insuredAddressId } = useSelector(selectProposal);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);
  const [addressesData, setAddressesData] = useState<InsuredAddressDTO[]>([]);

  useEffect(() => {
    if (insuredFederalId !== '') {
      const fetchAddresses = () => {
        setLoadingAddresses(true);
        InsuredAndPolicyholderSelectionApi.getInsuredAddresses(insuredFederalId)
          .then(data => {
            if (data.length === 1) {
              const { externalId } = data[0];
              dispatch(proposalActions.setInsuredAddressId(externalId));
            }
            setAddressesData(data);
          })
          .catch(() =>
            makeToast(
              'error',
              'Ocorreu um erro inesperado ao buscar os endereços do contratante.',
            ),
          )
          .finally(() => setLoadingAddresses(false));
      };
      fetchAddresses();
    }
  }, [dispatch, insuredFederalId]);

  const formatAddressString = (address: InsuredAddressDTO) => {
    const { street, city, state } = address;
    return `${street}${!!city && city !== '' ? ` - ${city}` : ''}${
      !!state && state !== '' ? `/${state}` : ''
    }`;
  };

  const getSelectedAddressInputValue = () => {
    if (insuredAddressId !== 0) {
      const address = addressesData.find(
        addr => addr.externalId === insuredAddressId,
      );
      if (address) {
        return formatAddressString(address);
      }
    }
    return '';
  };

  const handleAddressSelect = (option: DropdownOptions) => {
    const { value } = option;
    const address = addressesData.find(
      addr => addr.externalId === stringToInt(value),
    );
    if (address)
      dispatch(proposalActions.setInsuredAddressId(address.externalId));
  };

  const getDropdownOptions = () => {
    return addressesData.map(address => ({
      value: `${address.externalId}`,
      label: formatAddressString(address),
    }));
  };

  if (loadingAddresses) {
    return (
      <div className={styles['insured-address-selector__loading-input']}>
        <InputBase
          _isTypeable={false}
          data-testid="insuredAdressSelector-input-loading"
          label="Carregando..."
          placeholder="Carregando..."
          icon="loading"
        />
      </div>
    );
  }
  if (addressesData.length === 0 && insuredAddressId === 0) {
    return (
      <InputBase
        data-testid="insuredAdressSelector-input-disabled"
        disabled
        label="Endereço do Contratante"
        placeholder="Endereço do Contratante"
      />
    );
  }
  if (addressesData.length === 1 && insuredAddressId !== 0) {
    return (
      <InputBase
        data-testid="insuredAddressSelector-input-readonly"
        readOnly
        label="Endereço do Contratante"
        value={getSelectedAddressInputValue()}
      />
    );
  }
  return (
    <Dropdown
      data-testid="insuredAddressSelector-input-dropdown"
      label="Endereço do Contratante"
      placeholder="Selecione uma opção"
      options={getDropdownOptions()}
      value={
        insuredAddressId !== 0
          ? {
              value: `${insuredAddressId}`,
              label: getSelectedAddressInputValue(),
            }
          : null
      }
      onValueSelected={v => handleAddressSelect(v)}
    />
  );
};

export default InsuredAddressSelector;
