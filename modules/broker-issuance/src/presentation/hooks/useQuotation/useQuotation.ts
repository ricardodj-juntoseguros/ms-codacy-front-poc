import { useDispatch, useSelector } from 'react-redux';
import {
  postQuotation,
  putQuotation,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { quotationAdapter } from '../../../application/features/quote/adapters';
import { useValidate } from '../useValidate';
import {
  CreateQuotationSchema,
  UpdateQuotationSchema,
} from '../../../application/validations';
import { ValidationTypesEnum } from '../../../application/types/model';

export const useQuotation = () => {
  const validate = useValidate();
  const dispatch = useDispatch();
  const quote = useSelector(selectQuote);
  const { firstDueDate, hasProposalChanges } = useSelector(selectProposal);
  const { currentQuote, hasQuoteChanges, loadingQuote } = quote;

  const createQuotation = async () => {
    const payload = quotationAdapter(quote, firstDueDate, false);
    const valid = await validate(
      CreateQuotationSchema,
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
    if (!currentQuote) return;
    const payload = quotationAdapter(quote, firstDueDate, true);
    const valid = await validate(
      UpdateQuotationSchema,
      payload,
      ValidationTypesEnum.full,
      [],
      true,
    );
    if (valid) {
      const proposalId = currentQuote.identification.ProposalId;
      dispatch(putQuotation({ proposalId, quoteData: payload }));
    }
  };

  const createOrUpdateQuotation = async () => {
    if (loadingQuote) return;
    if (!quote.currentQuote) {
      createQuotation();
      return;
    }
    if (hasQuoteChanges || hasProposalChanges) {
      updateQuotation();
    }
  };

  return createOrUpdateQuotation;
};
