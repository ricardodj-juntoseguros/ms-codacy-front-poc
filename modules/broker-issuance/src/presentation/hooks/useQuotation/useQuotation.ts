/* eslint-disable consistent-return */
import { useDispatch, useSelector } from 'react-redux';
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
import { AppDispatch } from '../../../config/store';

export const useQuotation = () => {
  const validate = useValidate();
  const dispatch: AppDispatch = useDispatch();
  const quote = useSelector(selectQuote);
  const {
    firstDueDate,
    numberOfInstallments,
    identification: proposalIdentification,
  } = useSelector(selectProposal);
  const additionalCoverage = useSelector(selectAdditionalCoverage);
  const { hasAdditionalCoverageChanges } = additionalCoverage;
  const { setHasAdditionalCoverageChanges } = additionalCoverageActions;
  const { currentQuote, hasQuoteChanges, loadingQuote } = quote;

  const createQuotation = async () => {
    if (!quote.modality) return;
    const payload = quotationAdapter(
      quote,
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
      dispatch(postQuotation(payload));
    }
  };

  const updateQuotation = async () => {
    if (!currentQuote || !quote.modality) return;
    const payload = quotationAdapter(
      quote,
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
      dispatch(putQuotation({ proposalId, quoteData: payload })).then(() => {
        if (hasAdditionalCoverageChanges) {
          dispatch(setHasAdditionalCoverageChanges(false));
        }
      });
      if (proposalIdentification) {
        dispatch(proposalActions.setHasProposalChanges(true));
      }
    }
  };

  const createOrUpdateQuotation = async (isSyncUpdate = false) => {
    if (loadingQuote) return;
    if (!quote.currentQuote) {
      createQuotation();
      return;
    }
    if (hasQuoteChanges || isSyncUpdate || hasAdditionalCoverageChanges) {
      updateQuotation();
    }
  };

  return createOrUpdateQuotation;
};
