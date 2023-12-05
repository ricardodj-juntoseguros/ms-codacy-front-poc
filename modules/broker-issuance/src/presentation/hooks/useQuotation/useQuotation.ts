import { useDispatch, useSelector } from 'react-redux';
import {
  postQuotation,
  putQuotation,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
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
  const { currentQuote, hasQuoteChanges } = quote;

  const createQuotation = async () => {
    const payload = quotationAdapter(quote, false);
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
    const payload = quotationAdapter(quote, true);
    const valid = await validate(
      UpdateQuotationSchema,
      payload,
      ValidationTypesEnum.full,
      [],
      false,
    );
    if (valid) {
      const proposalId = currentQuote.identification.ProposalId;
      dispatch(putQuotation({ proposalId, quoteData: payload }));
    }
  };

  const createOrUpdateQuotation = async () => {
    if (!quote.currentQuote) {
      createQuotation();
      return;
    }
    if (hasQuoteChanges) {
      updateQuotation();
    }
  };

  return createOrUpdateQuotation;
};
