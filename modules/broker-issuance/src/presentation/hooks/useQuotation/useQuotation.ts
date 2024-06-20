/* eslint-disable consistent-return */
import { useDispatch, useSelector } from 'react-redux';
import { useFlow } from '@shared/hooks';
import {
  postQuotation,
  putQuotation,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import {
  selectProposal,
  proposalActions,
} from '../../../application/features/proposal/ProposalSlice';
import { quotationAdapter } from '../../../application/features/quote/adapters';
import { useValidate } from '../useValidate';
import { QUOTATITON_MODALITY_SCHEMAS } from '../../../application/validations';
import { ValidationTypesEnum } from '../../../application/types/model';
import {
  additionalCoverageActions,
  selectAdditionalCoverage,
} from '../../../application/features/additionalCoverage/AdditionalCoverageSlice';
import {
  policyRenewalActions,
  selectPolicyRenewal,
} from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import { AppDispatch } from '../../../config/store';

export const useQuotation = () => {
  const validate = useValidate();
  const { advanceStep } = useFlow();
  const dispatch: AppDispatch = useDispatch();
  const quote = useSelector(selectQuote);
  const policyRenewal = useSelector(selectPolicyRenewal);
  const {
    firstDueDate,
    numberOfInstallments,
    identification: proposalIdentification,
  } = useSelector(selectProposal);
  const additionalCoverage = useSelector(selectAdditionalCoverage);
  const { hasAdditionalCoverageChanges } = additionalCoverage;
  const { hasPolicyRenewalChanges } = policyRenewal;
  const { currentQuote, hasQuoteChanges, loadingQuote } = quote;
  const { setHasAdditionalCoverageChanges } = additionalCoverageActions;
  const { setHasPolicyRenewalChanges } = policyRenewalActions;

  const createQuotation = async (stepName?: string) => {
    if (!quote.modality) return;
    const payload = quotationAdapter(
      quote,
      policyRenewal,
      additionalCoverage,
      firstDueDate,
      numberOfInstallments,
      false,
    );
    const valid = await validate(
      QUOTATITON_MODALITY_SCHEMAS[quote.modality.id],
      payload,
      ValidationTypesEnum.full,
      [],
      false,
    );
    if (valid) {
      await dispatch(postQuotation(payload)).then(() => {
        if (hasPolicyRenewalChanges) {
          dispatch(setHasPolicyRenewalChanges(false));
        }
        if (stepName) advanceStep(stepName);
      });
    }
  };

  const updateQuotation = async (stepName?: string) => {
    if (!currentQuote || !quote.modality) return;
    const payload = quotationAdapter(
      quote,
      policyRenewal,
      additionalCoverage,
      firstDueDate,
      numberOfInstallments,
      true,
    );
    const valid = await validate(
      QUOTATITON_MODALITY_SCHEMAS[quote.modality.id],
      { ...payload, hasUpdate: true },
      ValidationTypesEnum.full,
      [],
      true,
    );
    if (valid) {
      const proposalId = currentQuote.identification.ProposalId;
      await dispatch(putQuotation({ proposalId, quoteData: payload })).then(
        () => {
          if (hasAdditionalCoverageChanges) {
            dispatch(setHasAdditionalCoverageChanges(false));
          }
          if (hasPolicyRenewalChanges) {
            dispatch(setHasPolicyRenewalChanges(false));
          }
          if (stepName) advanceStep(stepName);
        },
      );
      if (proposalIdentification) {
        dispatch(proposalActions.setHasProposalChanges(true));
      }
    }
  };

  const createOrUpdateQuotation = async (
    isSyncUpdate = false,
    stepName?: string,
  ) => {
    if (loadingQuote) return;
    if (!quote.currentQuote) {
      createQuotation(stepName);
      return;
    }
    if (
      hasQuoteChanges ||
      isSyncUpdate ||
      hasAdditionalCoverageChanges ||
      hasPolicyRenewalChanges
    ) {
      updateQuotation(stepName);
    }
  };

  return createOrUpdateQuotation;
};
