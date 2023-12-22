import { number, object } from 'yup';
import { CreateQuotationSchema } from './CreateQuotation';
import { store } from '../../../config/store';
import { MAX_STANDARD_FEE } from '../../../constants';

export const UpdateQuotationSchema = CreateQuotationSchema.concat(
  object().shape({
    pricing: object().shape({
      proposalFee: number()
        .positive()
        .required()
        .test('invalidProposalFeeValue', function proposalFeeValid() {
          const { proposalFee } = this.parent;
          if (proposalFee > MAX_STANDARD_FEE || proposalFee === 0) return false;
          return true;
        }),
      commissionFlex: number()
        .nullable()
        .notRequired()
        .test('required', function commissionFlexRequired() {
          const { commissionFlex } = this.parent;
          const { currentQuote, toggleRateFlex, isQuoteResume } =
            store.getState().quote;
          if (!currentQuote) return false;
          if (isQuoteResume && !currentQuote.pricing) return true;
          const {
            pricing: { commissionFlexEnabled },
          } = currentQuote;
          if (!commissionFlexEnabled || !toggleRateFlex) return true;
          return (
            commissionFlex !== undefined &&
            commissionFlex !== null &&
            commissionFlex > 0
          );
        })
        .test('invalidCommissionFlexValue', function commissionFlexValid() {
          const { commissionFlex } = this.parent;
          const { currentQuote, isQuoteResume } = store.getState().quote;
          if (!currentQuote) return false;
          if (isQuoteResume && !currentQuote.pricing) return true;
          const {
            pricing: { commissionFlexEnabled, commissionFlexMaxValue },
          } = currentQuote;
          if (commissionFlexEnabled) {
            return (commissionFlex || 0) <= (commissionFlexMaxValue || 0);
          }
          return true;
        }),
      feeFlex: number()
        .nullable()
        .notRequired()
        .test('required', function commissionFlexRequired() {
          const { feeFlex } = this.parent;
          const { currentQuote, toggleRateFlex, isQuoteResume } =
            store.getState().quote;
          if (!currentQuote) return false;
          if (isQuoteResume && !currentQuote.pricing) return true;
          const {
            pricing: { feeFlexEnabled },
          } = currentQuote;
          if (!feeFlexEnabled || !toggleRateFlex) return true;
          return feeFlex !== undefined && feeFlex !== null && feeFlex > 0;
        })
        .test('invalidFeeFlexValue', function commissionFlexValid() {
          const { feeFlex } = this.parent;
          const { currentQuote, isQuoteResume } = store.getState().quote;
          if (!currentQuote) return false;
          if (isQuoteResume && !currentQuote.pricing) return true;
          const {
            pricing: { feeFlexEnabled, feeFlexMaxValue },
          } = currentQuote;
          if (feeFlexEnabled) {
            return (feeFlex || 0) <= (feeFlexMaxValue || 0);
          }
          return true;
        }),
    }),
  }),
);
