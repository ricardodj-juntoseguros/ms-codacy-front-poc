import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StepContainer } from '@libs/shared/ui';
import { ContractData } from '../contractData/ContractData';
import { selectSearchInsured } from '../../../application/features/searchInsured/SearchInsuredSlice';
import {
  selectQuote,
  setContractInsured,
  setContractInsuredAddress,
  setContractInstallment,
  setContractNumber,
  setContractAttachmentNotice,
  setContractFirstInstallment,
  setContractPolicyInProgress,
  setContractContacts,
  setContractComments,
} from '../../../application/features/quote/QuoteSlice';
import {
  AddressModel,
  InstallmentModel,
  InsuredModel,
} from '../../../application/types/model';

export function ContractDataContainer() {
  const dispatch = useDispatch();
  const [insuredValue, setInsuredValue] = useState('');

  const { contractData, installments } = useSelector(selectQuote);
  const {
    insured,
    contractNumber,
    attachmentNotice,
    firstInstallment,
    policyInProgress,
    comments,
  } = contractData;
  const { addresses = [], insuredTypeDescription } = { ...insured };

  const { searchInsuredOptions } = useSelector(selectSearchInsured);

  function handleSetInstallment(selectedInstallment: InstallmentModel) {
    dispatch(setContractInstallment(selectedInstallment));
  }

  function handleInsuredSelection(selectedInsured: InsuredModel) {
    dispatch(setContractInsured(selectedInsured));
  }

  function handleAddressSelection(selectedAddress: AddressModel) {
    dispatch(setContractInsuredAddress(selectedAddress));
  }

  function handleChangeContractNumber(value: string) {
    dispatch(setContractNumber(value));
  }

  function handleChangeAttachmentNotice(value: string) {
    dispatch(setContractAttachmentNotice(value));
  }

  function handleChangeFirstInstallment(installmentDate: Date) {
    dispatch(setContractFirstInstallment(installmentDate));
  }

  function handleTogglePolicyInProgress() {
    dispatch(setContractPolicyInProgress(!policyInProgress));
  }

  function handleChangeContactEmails(emails: string[]) {
    dispatch(setContractContacts(emails));
  }

  function handleChangeComments(value: string) {
    dispatch(setContractComments(value));
  }

  function StepTitle() {
    return (
      <title>
        Complete os <strong>dados</strong>
      </title>
    );
  }

  return (
    <div>
      <StepContainer stepNumber={4} title={StepTitle()}>
        <ContractData
          insuredValue={insuredValue}
          searchInsuredOptions={searchInsuredOptions}
          addressOptions={addresses}
          insuredType={insuredTypeDescription}
          contractNumber={contractNumber}
          attachmentNotice={attachmentNotice}
          policyPreview={{
            title: 'O objeto da sua apólice de seguro ficará assim:',
            description:
              'Esta apólice, de riscos declarados, garante indenização, até o valor fixado na apólice, dos prejuízos causados pelo Tomador ao Segurado, em razão de inadimplemento na prestação dos serviços descritos no objeto do Contrato',
          }}
          installmentOptions={installments}
          firstInstallment={firstInstallment}
          policyInProgress={policyInProgress}
          comments={comments}
          onChangeInsuredValue={value => setInsuredValue(value)}
          onChangeContractNumber={value => handleChangeContractNumber(value)}
          onChangeAttachmentNotice={value =>
            handleChangeAttachmentNotice(value)
          }
          onChangeEmails={mails => handleChangeContactEmails(mails)}
          onChangeFirstInstallment={date => handleChangeFirstInstallment(date)}
          onChangePolicyInProgress={() => handleTogglePolicyInProgress()}
          onChangeComments={comment => handleChangeComments(comment)}
          onSelectInsured={selectedInsured =>
            handleInsuredSelection(selectedInsured)
          }
          onSelectAddress={selectedAddress =>
            handleAddressSelection(selectedAddress)
          }
          onSelectInstallment={selectedInstallment =>
            handleSetInstallment(selectedInstallment)
          }
        />
      </StepContainer>
    </div>
  );
}
