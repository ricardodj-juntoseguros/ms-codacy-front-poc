import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import {
  policyholderAndModalitySummaryAdapter,
  validityAndValueSummaryAdapter,
  documentsSummaryAdapter,
  insuredDataSummaryAdapter,
  additionalDataSummaryAdapter,
} from '../../../application/features/sideSummary/adapters';
import { selectPolicyholder } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import { selectContractualCondition } from '../../../application/features/contractualCondition/ContractualConditionSlice';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectProposalDocuments } from '../../../application/features/proposalDocuments/ProposalDocumentsSlice';

export function useFormSummary() {
  const { currentAppointmentLetter } = useSelector(selectPolicyholder);
  const {
    policyholder,
    policyholderAffiliate,
    modality,
    startDateValidity,
    endDateValidity,
    durationInDays,
    securedAmount,
    currentQuote,
  } = useSelector(selectQuote);
  const {
    insured,
    insuredAddress,
    biddingNumber,
    biddingDescription,
    paymentType,
    numberOfInstallments,
    firstDueDate,
  } = useSelector(selectProposal);
  const { openContractualConditions, requestedBy } = useSelector(
    selectContractualCondition,
  );
  const { proposalDocuments } = useSelector(selectProposalDocuments);

  const policyholderAndModalityFormSummary = useMemo(() => {
    return policyholderAndModalitySummaryAdapter(
      policyholder,
      policyholderAffiliate,
      modality,
    );
  }, [policyholder, policyholderAffiliate, modality]);

  const validityAndValueFormSummary = useMemo(() => {
    return validityAndValueSummaryAdapter(
      startDateValidity,
      endDateValidity,
      durationInDays,
      securedAmount,
      currentQuote,
    );
  }, [
    startDateValidity,
    endDateValidity,
    durationInDays,
    securedAmount,
    currentQuote,
  ]);

  const insuredDataFormSummary = useMemo(() => {
    return insuredDataSummaryAdapter(
      insured,
      insuredAddress,
      biddingNumber,
      biddingDescription,
      openContractualConditions,
      requestedBy,
    );
  }, [
    insured,
    insuredAddress,
    biddingNumber,
    biddingDescription,
    openContractualConditions,
    requestedBy,
  ]);

  const additionalDataFormSummary = useMemo(() => {
    return additionalDataSummaryAdapter(
      currentQuote,
      paymentType,
      numberOfInstallments,
      firstDueDate,
    );
  }, [currentQuote, paymentType, numberOfInstallments, firstDueDate]);

  const getSummaryData = useCallback(
    (formName: string) => {
      const formSummariesData: {
        [x: string]: { key: string; label: string; value: string }[];
      } = {
        PolicyholderAndModalityForm: policyholderAndModalityFormSummary,
        ValidityAndValueForm: validityAndValueFormSummary,
        InsuredDataForm: insuredDataFormSummary,
        AdditionalDataForm: additionalDataFormSummary,
      };
      return formSummariesData[formName] || [];
    },
    [
      policyholderAndModalityFormSummary,
      validityAndValueFormSummary,
      insuredDataFormSummary,
      additionalDataFormSummary,
    ],
  );

  const uploadedDocumentsSummary = useMemo(() => {
    return documentsSummaryAdapter(currentAppointmentLetter, proposalDocuments);
  }, [currentAppointmentLetter, proposalDocuments]);

  return { getSummaryData, uploadedDocumentsSummary };
}
