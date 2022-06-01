import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { getValidationSchemaByModality } from '../../../application/validations';
import {
  selectQuote,
  generateQuote,
} from '../../../application/features/quote/QuoteSlice';
import { useAppDispatch } from '../../../config/store';
import { validateForm } from '../../../application/features/validation/ValidationSlice';
import { ValidationModel } from '../../../application/types/model';
import { quoteAdapter } from '../../../application/features/quote/adapters';

export function useGenerateQuote() {
  const dispatch = useAppDispatch();
  const quote = useSelector(selectQuote);

  const schemaValidation = useMemo(
    () => getValidationSchemaByModality('quote', quote.modality?.id),
    [quote.modality],
  );

  const fechGenerateQuote = async () => {
    if (!quote.hasQuoteChanges) {
      return { quoteGeneratedSuccessfully: false };
    }

    const quotePayload = quoteAdapter(quote);
    const validateResult = await dispatch(
      validateForm({
        schema: schemaValidation,
        data: quote,
      }),
    );
    const { isValidForm } = validateResult.payload as ValidationModel;

    if (!isValidForm) {
      return { quoteGeneratedSuccessfully: false };
    }

    await dispatch(generateQuote(quotePayload));

    return { quoteGeneratedSuccessfully: true };
  };

  return { fechGenerateQuote };
}
