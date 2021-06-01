import {
  Dropdown,
  SearchInput,
  DateInput,
  NumberInput,
  Toggle,
  TextArea,
  TagInput,
  DropdownOption,
} from '@libs/shared/junto-design-system';
import { ObjectPreview, ObjectPreviewProps } from '@libs/shared/ui';
import classNames from 'classnames';
import styles from './ContractData.module.scss';

export interface ContractDataProps {
  searchInsuredOptions: Array<string>;
  insuredValue: string;
  addressOptions: Array<DropdownOption>;
  insuredType: string;
  contractNumber: string;
  attachmentNotice: number;
  policyPreview: ObjectPreviewProps;
  installmentOptions: Array<DropdownOption>;
  firstInstallment: Date;
  policyInProgress: boolean;
  comments: string;
  handleSetInsuredValue(option: string): void;
  handleSetAddress(option: DropdownOption | null): void;
  handleSetContractNumber(value: string): void;
  handleSetAttachmentNotice(value: number): void;
  handleSetInstallment(option: DropdownOption | null): void;
  handleSetFirstInstallment(value: Date): void;
  handleSetEmails(emails: string[]): void;
  handleSetPolicyInProgress(): void;
  handleSetComments(value: string): void;
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
  handleSetInsuredValue,
  handleSetAddress,
  handleSetContractNumber,
  handleSetAttachmentNotice,
  handleSetInstallment,
  handleSetEmails,
  handleSetFirstInstallment,
  handleSetPolicyInProgress,
  handleSetComments,
}: ContractDataProps) {
  return (
    <div className={styles['contract-data__wrapper']}>
      <div className={styles['contract-data__form-field']}>
        {/* <SearchInput
          label="CNPJ ou razão social do segurado"
          placeholder=" "
          type="text"
          onChange={handleSetInsuredValue}
          value={insuredValue}
          icon="search"
          options={searchInsuredOptions}
        /> */}
      </div>

      <div className={styles['contract-data__form-field']}>
        <Dropdown
          placeholder="Selecione o endereço do segurado"
          options={addressOptions}
          isSearchable={false}
          onChange={handleSetAddress}
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
          placeholder="N.º do contrato/edital"
          value={contractNumber}
          onChange={e => handleSetContractNumber(e.target.value)}
          maxLength={500}
        />
      </div>

      <div className={styles['contract-data__form-field']}>
        <NumberInput
          label="Anexo do edital"
          placeholder=" "
          value={attachmentNotice}
          onChange={handleSetAttachmentNotice}
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
            options={installmentOptions}
            isSearchable={false}
            onChange={handleSetInstallment}
          />
        </div>
        <div className={styles['contract-data__form-field']}>
          <DateInput
            label="Primeira parcela"
            value={firstInstallment}
            onChange={handleSetFirstInstallment}
          />
        </div>
      </div>

      <div className={styles['contract-data__form-field']}>
        <TagInput
          label="Adicionar e-mails para recebimento da apólice"
          placeholder=" "
          onValueChange={handleSetEmails}
        />
      </div>

      <div className={styles['contract-data__form-toggle']}>
        <Toggle
          name="policyInProgess"
          label="Este processo trata-se de uma apólice em andamento"
          checked={policyInProgress}
          onChange={handleSetPolicyInProgress}
        />
      </div>

      <div className={styles['contract-data__form-field']}>
        <TextArea
          label=" "
          placeholder="Observações"
          value={comments}
          onChange={e => handleSetComments(e.target.value)}
        />
      </div>
    </div>
  );
}
