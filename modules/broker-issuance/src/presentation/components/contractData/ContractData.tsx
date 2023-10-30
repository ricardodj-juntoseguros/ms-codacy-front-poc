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
import { useMemo } from 'react';
import { currencyFormatter } from '../../../helpers';
import {
  AddressModel,
  InsuredModel,
  InstallmentModel,
} from '../../../application/types/model';
import styles from './ContractData.module.scss';

export interface ContractDataProps {
  insuredInput: string;
  insuredOptions: InsuredModel[];
  address: AddressModel | null;
  addressOptions: AddressModel[];
  insuredTypeDescription: string;
  contractNumber: string;
  attachmentNotice: string;
  policyPreview: ObjectPreviewProps;
  installment: InstallmentModel | null;
  installmentOptions: InstallmentModel[];
  firstInstallment: string;
  emails: string[];
  policyInProgress: boolean;
  comments: string;
  onChangeInsuredInput(option: string): void;
  onSelectInsured: (value: InsuredModel) => void;
  onSelectAddress(option: AddressModel): void;
  onChangeContractNumber(value: string): void;
  onChangeAttachmentNotice(value: string): void;
  onSelectInstallment(option: InstallmentModel): void;
  onChangeFirstInstallment(value: string): void;
  onChangeEmails(emails: string[]): void;
  onChangePolicyInProgress(): void;
  onChangeComments(value: string): void;
}

export function ContractData({
  insuredInput,
  insuredOptions,
  address,
  addressOptions,
  insuredTypeDescription,
  contractNumber,
  attachmentNotice,
  policyPreview,
  installment,
  installmentOptions,
  firstInstallment,
  emails,
  policyInProgress,
  comments,
  onChangeInsuredInput,
  onSelectInsured,
  onSelectAddress,
  onChangeContractNumber,
  onChangeAttachmentNotice,
  onSelectInstallment,
  onChangeFirstInstallment,
  onChangeEmails,
  onChangePolicyInProgress,
  onChangeComments,
}: ContractDataProps) {
  const {
    mappedOptions: mappedInsuredOptions,
    selectOption: setInsuredOption,
  } = useOptionsMapper(
    insuredOptions,
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

  const currentAddress = useMemo(() => {
    return (
      mappedAddressOptions.find(
        item => item.externalId === address?.externalId,
      ) || null
    );
  }, [address, mappedAddressOptions]);

  // function formatInstallment(installment: InstallmentModel) {
  //   return `${installment.number} - À vista em ${currencyFormatter(
  //     installment.installmentValue,
  //   )} `;
  // }

  const {
    mappedOptions: mappedInstallmentOptions,
    selectOption: setInstallmentOption,
  } = useOptionsMapper(
    installmentOptions,
    '',
    '',
    'number',
    onSelectInstallment,
    // formatInstallment,
  );

  // const currentInstallment = useMemo(() => {
  // return (
  //   mappedInstallmentOptions.find(
  //     item => item.number === installment?.number,
  //   ) || null
  // );
  // return [];
  // }, [installment, mappedInstallmentOptions]);

  return (
    <div className={styles['contract-data__wrapper']}>
      <div className={styles['contract-data__form-field']}>
        <SearchInput
          label="CNPJ ou razão social do segurado"
          placeholder="CNPJ ou razão social do segurado"
          onChange={onChangeInsuredInput}
          value={insuredInput}
          options={mappedInsuredOptions}
          onValueSelected={setInsuredOption}
        />
      </div>

      <div className={styles['contract-data__form-field']}>
        <Dropdown
          label="Selecione o endereço do segurado"
          placeholder="Selecione o endereço do segurado"
          options={mappedAddressOptions}
          onValueSelected={setAddressOption}
          value={currentAddress}
        />
      </div>

      <div
        className={classNames(
          styles['contract-data__form-field'],
          styles['contract-data__form-info-preview'],
        )}
      >
        <p>Tipo de segurado</p>
        <p>{insuredTypeDescription}</p>
      </div>

      <div className={styles['contract-data__form-field']}>
        <TextArea
          label="N.º do contrato/edital"
          placeholder="N.º do contrato/edital"
          value={contractNumber}
          onChange={e => onChangeContractNumber(e.target.value)}
          maxLength={500}
        />
      </div>

      <div className={styles['contract-data__form-field']}>
        <InputBase
          label="Anexo do edital"
          placeholder="Anexo do edital"
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
          {/* <Dropdown
            label="Parcelas"
            placeholder="Parcelas"
            options={mappedInstallmentOptions}
            onValueSelected={setInstallmentOption}
            value={currentInstallment}
          /> */}
        </div>
        <div className={styles['contract-data__form-field']}>
          <DateInput
            label="Primeira parcela"
            value={firstInstallment}
            onChange={(value, valid) => onChangeFirstInstallment(value)}
          />
        </div>
      </div>

      {/* <div className={styles['contract-data__form-field']}>
        <TagInput
          label="Adicionar e-mails para recebimento da apólice"
          placeholder="Adicionar e-mails para recebimento da apólice"
          onValueChange={onChangeEmails}
          value={emails}
          helperMessage="Para mais de um destinatário, escreva os endereços de e-mail separados por ponto e vírgula (;)."
        />
      </div> */}

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
          label="Observações"
          placeholder="Observações"
          value={comments}
          onChange={event => onChangeComments(event.target.value)}
        />
      </div>
    </div>
  );
}
