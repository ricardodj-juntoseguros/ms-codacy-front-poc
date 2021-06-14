import { useMemo } from 'react';
import classNames from 'classnames';
import {
  Dropdown,
  SearchInput,
  DateInput,
  Toggle,
  TextArea,
  TagInput,
  DropdownOption,
  InputBase,
  OptionProps,
} from '@libs/shared/junto-design-system';
import { ObjectPreview, ObjectPreviewProps } from '@libs/shared/ui';
import { currencyFormatter } from '../../../helpers';
import {
  AddressModel,
  InsuredModel,
  InstallmentModel,
} from '../../../application/types/model';
import styles from './ContractData.module.scss';

export interface ContractDataProps {
  searchInsuredOptions: InsuredModel[];
  insuredValue: string;
  addressOptions: AddressModel[];
  insuredType: string | undefined;
  contractNumber: string;
  attachmentNotice: string;
  policyPreview: ObjectPreviewProps;
  installmentOptions: InstallmentModel[];
  firstInstallment: Date | null;
  policyInProgress: boolean;
  comments: string;
  onChangeInsuredValue(option: string): void;
  onSelectInsured: (value: InsuredModel) => void;
  onSelectAddress(option: AddressModel): void;
  onChangeContractNumber(value: string): void;
  onChangeAttachmentNotice(value: string): void;
  onSelectInstallment(option: InstallmentModel): void;
  onChangeFirstInstallment(value: Date): void;
  onChangeEmails(emails: string[]): void;
  onChangePolicyInProgress(): void;
  onChangeComments(value: string): void;
}

export function ContractData({
  insuredValue,
  searchInsuredOptions,
  addressOptions,
  insuredType,
  contractNumber,
  attachmentNotice,
  policyPreview,
  installmentOptions,
  firstInstallment,
  policyInProgress,
  comments,
  onChangeInsuredValue,
  onSelectInsured,
  onSelectAddress,
  onChangeContractNumber,
  onChangeAttachmentNotice,
  onSelectInstallment,
  onChangeEmails,
  onChangeFirstInstallment,
  onChangePolicyInProgress,
  onChangeComments,
}: ContractDataProps) {
  const mapInsuredOptions = useMemo(() => {
    return searchInsuredOptions.map(insured => ({
      ...insured,
      label: insured.name,
      id: insured.externalId,
    }));
  }, [searchInsuredOptions]);

  const mapAdressOptions: DropdownOption[] = useMemo(() => {
    return addressOptions.map(address => ({
      ...address,
      label: address.street,
      value: address.externalId,
    }));
  }, [addressOptions]);

  const mapInstallmentOptions: DropdownOption[] = useMemo(() => {
    return installmentOptions.map(installment => ({
      ...installment,
      label: `${installment.number} - À vista em ${currencyFormatter(
        installment.installmentValue,
      )} `,
      value: installment.number,
    }));
  }, [installmentOptions]);

  function onChangeInsuredSearch(option: OptionProps) {
    const selectedInsured = searchInsuredOptions.find(
      insured => insured.externalId === option.id,
    );

    if (selectedInsured) onSelectInsured(selectedInsured);
  }

  function onChangeAddressOptionDropdown(option: DropdownOption | null) {
    if (option) {
      const selectedAddress = addressOptions.find(
        address => address.addressId === option.value,
      );

      if (selectedAddress) onSelectAddress(selectedAddress);
    }
  }

  function onChangeInstallmentOptionDropdown(option: DropdownOption | null) {
    if (option) {
      const selectedInstallment = installmentOptions.find(
        installment => installment.number === option.value,
      );

      if (selectedInstallment) onSelectInstallment(selectedInstallment);
    }
  }

  return (
    <div className={styles['contract-data__wrapper']}>
      <div className={styles['contract-data__form-field']}>
        <SearchInput
          label="CNPJ ou razão social do segurado"
          placeholder=" "
          onValueSelected={onChangeInsuredSearch}
          onChange={onChangeInsuredValue}
          value={insuredValue}
          options={mapInsuredOptions}
        />
      </div>

      <div className={styles['contract-data__form-field']}>
        <Dropdown
          placeholder="Selecione o endereço do segurado"
          options={mapAdressOptions}
          isSearchable={false}
          onChange={onChangeAddressOptionDropdown}
        />
      </div>

      <div
        className={classNames(
          styles['contract-data__form-field'],
          styles['contract-data__form-info-preview'],
        )}
      >
        <p>Tipo de segurado</p>
        <p>{insuredType}</p>
      </div>

      <div className={styles['contract-data__form-field']}>
        <TextArea
          label=" "
          labelInternal="N.º do contrato/edital"
          placeholder="N.º do contrato/edital"
          value={contractNumber}
          onChange={e => onChangeContractNumber(e.target.value)}
          maxLength={500}
        />
      </div>

      <div className={styles['contract-data__form-field']}>
        <InputBase
          label="Anexo do edital"
          placeholder=" "
          value={attachmentNotice}
          onChange={e => onChangeAttachmentNotice(e.target.value)}
        />
      </div>

      <div
        className={classNames(
          styles['contract-data__form-field'],
          styles['contract-data__form-info-preview'],
        )}
      >
        <ObjectPreview
          title={policyPreview.title}
          description={policyPreview.description}
        />
      </div>

      <div className={styles['contract-data__form-row']}>
        <div className={styles['contract-data__form-field']}>
          <Dropdown
            placeholder="Parcelas"
            options={mapInstallmentOptions}
            isSearchable={false}
            onChange={onChangeInstallmentOptionDropdown}
          />
        </div>
        <div className={styles['contract-data__form-field']}>
          <DateInput
            label="Primeira parcela"
            value={firstInstallment}
            onChange={onChangeFirstInstallment}
          />
        </div>
      </div>

      <div className={styles['contract-data__form-field']}>
        <TagInput
          label="Adicionar e-mails para recebimento da apólice"
          placeholder=" "
          onValueChange={onChangeEmails}
        />
      </div>

      <div className={styles['contract-data__form-toggle']}>
        <Toggle
          name="policyInProgess"
          label="Este processo trata-se de uma apólice em andamento"
          checked={policyInProgress}
          onChange={onChangePolicyInProgress}
        />
      </div>

      <div className={styles['contract-data__form-field']}>
        <TextArea
          label=" "
          labelInternal="Observações"
          placeholder="Observações"
          value={comments}
          onChange={e => onChangeComments(e.target.value)}
        />
      </div>
    </div>
  );
}
