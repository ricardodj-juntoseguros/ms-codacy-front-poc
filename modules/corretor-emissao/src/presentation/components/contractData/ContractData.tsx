import classNames from 'classnames';
import {
  Dropdown,
  SearchInput,
  DateInput,
  Toggle,
  TextArea,
  TagInput,
  InputBase,
} from 'junto-design-system';
import { ObjectPreview, ObjectPreviewProps } from '@shared/ui';
import { useOptionsMapper } from '@shared/hooks';
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
  addressValue: string;
  setAddressValue: (value: string) => void;
  insuredType: string | undefined;
  contractNumber: string;
  attachmentNotice: string;
  policyPreview: ObjectPreviewProps;
  installmentOptions: InstallmentModel[];
  installmentValue: string;
  setInstallmentValue: (value: string) => void;
  firstInstallment: string | null;
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
  addressValue,
  setAddressValue,
  insuredType,
  contractNumber,
  attachmentNotice,
  policyPreview,
  installmentOptions,
  installmentValue,
  setInstallmentValue,
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
  const {
    mappedOptions: mappedInsuredOptions,
    selectOption: setInsuredOption,
  } = useOptionsMapper(
    searchInsuredOptions,
    'name',
    'federalId',
    'externalId',
    onSelectInsured,
  );

  const {
    mappedOptions: mappedAddressOptions,
    selectOption: setAddressOption,
  } = useOptionsMapper(
    addressOptions,
    'street',
    '',
    'externalId',
    onSelectAddress,
  );

  const {
    mappedOptions: mappedInstallmentOptions,
    selectOption: setInstallmentOption,
  } = useOptionsMapper(
    installmentOptions,
    '',
    '',
    'number',
    onSelectInstallment,
    formatInstallment,
  );

  function formatInstallment(installment: InstallmentModel) {
    return `${installment.number} - À vista em ${currencyFormatter(
      installment.installmentValue,
    )} `;
  }

  return (
    <div className={styles['contract-data__wrapper']}>
      <div className={styles['contract-data__form-field']}>
        <SearchInput
          label="CNPJ ou razão social do segurado"
          placeholder=" "
          onValueSelected={option => setInsuredOption(option)}
          onChange={onChangeInsuredValue}
          value={insuredValue}
          options={mappedInsuredOptions}
        />
      </div>

      <div className={styles['contract-data__form-field']}>
        <Dropdown
          label="Selecione o endereço do segurado"
          placeholder="Selecione o endereço do segurado"
          options={mappedAddressOptions}
          onValueSelected={setAddressOption}
          onChange={setAddressValue}
          value={addressValue}
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
            label="Parcelas"
            placeholder="Parcelas"
            options={mappedInstallmentOptions}
            onValueSelected={setInstallmentOption}
            onChange={setInstallmentValue}
            value={installmentValue}
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
