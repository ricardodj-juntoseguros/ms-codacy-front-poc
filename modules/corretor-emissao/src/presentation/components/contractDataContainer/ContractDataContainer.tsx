import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StepContainer } from '@shared/ui';
import { formatISO } from 'date-fns';
import { searchInsured } from '../../../application/features/searchInsured/thunks/SearchInsuredThunk';
import { selectFlow } from '../../../application/features/flow/FlowSlice';
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
import { getStepByName } from '../../../helpers';

export function ContractDataContainer() {
  const dispatch = useDispatch();
  const [insuredValue, setInsuredValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [installmentValue, setInstallmentValue] = useState('');

  const { contractData, installments, loadingQuote } = useSelector(selectQuote);
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

  const { steps } = useSelector(selectFlow);
  const stepStatus = useMemo(() => {
    return getStepByName('ContractDataContainer', steps);
  }, [steps]);

  useEffect(() => {
    if (insuredValue !== '' && insuredValue.length > 3) {
      dispatch(searchInsured(insuredValue));
    }
  }, [dispatch, insuredValue]);

  useEffect(() => {
    if (
      insured &&
      addresses &&
      contractNumber &&
      attachmentNotice &&
      firstInstallment &&
      policyInProgress
    ) {
      // dispatch(
      //   setStepStatus({ name: 'contractDataContainer', isCompleted: true }),
      // );
    }
  }, [
    addresses,
    attachmentNotice,
    contractNumber,
    dispatch,
    firstInstallment,
    insured,
    policyInProgress,
  ]);

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
    dispatch(setContractFirstInstallment(formatISO(installmentDate)));
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
      <StepContainer
        stepNumber={stepStatus?.number}
        isVisible={stepStatus?.isVisible}
        isEnabled={stepStatus?.isEnabled}
        isLoading={stepStatus?.isLoading || loadingQuote}
        title={StepTitle()}
      >
        <ContractData
          insuredValue={insuredValue}
          searchInsuredOptions={searchInsuredOptions}
          addressOptions={addresses}
          addressValue={addressValue}
          setAddressValue={setAddressValue}
          insuredType={insuredTypeDescription}
          contractNumber={contractNumber}
          attachmentNotice={attachmentNotice}
          policyPreview={{
            title: 'O objeto da sua apólice de seguro ficará assim:',
            description:
              'Esta apólice, de riscos declarados, garante indenização, até o valor fixado na apólice, dos prejuízos causados pelo Tomador ao Segurado, em razão de inadimplemento na prestação dos serviços descritos no objeto do Contrato',
          }}
          installmentOptions={installments}
          installmentValue={installmentValue}
          setInstallmentValue={setInstallmentValue}
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
