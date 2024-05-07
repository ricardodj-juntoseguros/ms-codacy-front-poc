import { FunctionComponent, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Dropdown,
  LinkButton,
  Modal,
  SearchInput,
} from 'junto-design-system';
import { useDebounce } from '@shared/hooks';
import { mapInsuredAddressesOption } from '../../../helpers';
import { InsuredAddressDTO } from '../../../application/types/dto';
import { InsuredModel } from '../../../application/types/model';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import {
  insuredSelectionActions,
  searchInsured,
  selectInsuredSelection,
} from '../../../application/features/insuredSelection/InsuredSelectionSlice';
import NewInsuredAddressForm from '../NewInsuredAddressForm';
import { useProposal } from '../../hooks';
import styles from './InsuredSelection.module.scss';

const InsuredSelection: FunctionComponent = () => {
  const [showEmptyOptions, setShowEmptyOptions] = useState(false);
  const [newAddressModalOpen, setNewAddressModalOpen] = useState(false);
  const dispatch = useDispatch();
  const {
    insuredSearchValue,
    insuredOptions,
    loadingSearchInsureds,
    insuredAddressesOptions,
    hasInsuredInactive,
  } = useSelector(selectInsuredSelection);
  const { setInsuredSearchValue, setInsuredAddressesOptions } =
    insuredSelectionActions;
  const { insured, insuredAddress } = useSelector(selectProposal);
  const updateProposal = useProposal();
  const { setInsured, setInsuredAddress } = proposalActions;

  useDebounce(
    () => {
      if (insuredSearchValue.length >= 3 && !isCurrentValueFromOptions) {
        dispatch(searchInsured(insuredSearchValue));
      }
    },
    1000,
    [insuredSearchValue],
  );

  useDebounce(
    () => {
      if (insuredSearchValue.length >= 3 && !loadingSearchInsureds) {
        setShowEmptyOptions(true);
        return;
      }
      setShowEmptyOptions(false);
    },
    1250,
    [insuredSearchValue, loadingSearchInsureds, insuredOptions],
  );

  useDebounce(() => updateProposal(), 250, [insuredAddress]);

  const isCurrentValueFromOptions = useMemo(() => {
    return !!insuredOptions.find(opt => opt.label === insuredSearchValue);
  }, [insuredOptions, insuredSearchValue]);

  const onSetInsuredAddressesOptions = (
    selectionOptions: InsuredAddressDTO[],
  ) => {
    const filteredOptions = selectionOptions.filter(option => option.street);
    dispatch(setInsuredAddressesOptions(filteredOptions));
    if (filteredOptions.length === 1) {
      dispatch(
        setInsuredAddress(mapInsuredAddressesOption(filteredOptions[0])),
      );
    }
  };

  const handleSearchInsureds = (value: string) => {
    if (value.length === 0) {
      dispatch(setInsured(null));
      dispatch(setInsuredAddress(null));
    }
    dispatch(setInsuredSearchValue(value));
  };

  const handleSelectInsured = (optionSelected: InsuredModel) => {
    dispatch(setInsuredAddress(null));
    dispatch(setInsured(optionSelected));
    onSetInsuredAddressesOptions(optionSelected.addresses);
    updateProposal();
  };

  const handleSelectInsuredAddress = (optionSelected: InsuredModel) => {
    dispatch(setInsuredAddress(optionSelected));
  };

  const renderInsuredType = () => {
    if (!insured) return null;
    const { type } = insured;
    return (
      <div className={styles['insured-selection__type']}>
        <p className={styles['insured-selection__type-description']}>
          Tipo de segurado
        </p>
        <p className={styles['insured-selection__type-value']}>
          {type.description}
        </p>
      </div>
    );
  };

  return (
    <div className={styles['insured-selection__wrapper']}>
      <SearchInput
        id="insuredSelection-search-input"
        data-testid="insuredSelection-search-input"
        label="CNPJ ou Razão Social do segurado"
        placeholder="Pesquise o segurado pelo CNPJ ou Razão Social"
        onChange={handleSearchInsureds}
        changeValueOnSelect
        value={insuredSearchValue}
        options={insuredOptions}
        onValueSelected={handleSelectInsured}
        emptyMessage="Segurado não encontrado..."
        showEmptyOptions={showEmptyOptions}
        loading={loadingSearchInsureds}
        autoComplete="off"
      />
      {insuredOptions.length === 0 && hasInsuredInactive && (
        <div className={styles['insured-selection__alert']}>
          <Alert
            data-testid="insuredSelection-search-alert"
            variant="error"
            icon="x-circle"
            arrow="top-start"
            text="Parece que esse segurado está inativo na companhia. Você só pode prosseguir com segurados ativos. Em caso de dúvida, entre em contato via chat."
            fullWidth
          />
        </div>
      )}
      {renderInsuredType()}
      <p className={styles['insured-selection__description']}>Endereço</p>
      <Dropdown
        id="insuredDataForm-address-input-dropdown"
        data-testid="insuredDataForm-address-input-dropdown"
        label="Selecione o endereço"
        placeholder="Selecione uma opção"
        options={insuredAddressesOptions}
        value={insuredAddress}
        onValueSelected={handleSelectInsuredAddress}
        disabled={insured === null}
        loading={false}
      />
      <div>
        <LinkButton
          disabled={!insured}
          label="Adicionar novo endereço"
          icon="plus"
          size="large"
          onClick={() => setNewAddressModalOpen(true)}
        />
        <Modal
          open={newAddressModalOpen}
          onCloseButtonClick={() => setNewAddressModalOpen(false)}
          size="large"
          width={640}
        >
          <NewInsuredAddressForm
            closeModalCallback={() => setNewAddressModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default InsuredSelection;
