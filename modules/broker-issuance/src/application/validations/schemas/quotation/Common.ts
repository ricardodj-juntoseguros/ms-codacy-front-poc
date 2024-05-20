import { number, object, string } from 'yup';
import { isAfter, isSameDay, parseISO, startOfDay, subDays } from 'date-fns';
import { federalIdValidator } from '@shared/utils';
import { store } from '../../../../config/store';
import {
  MAX_STANDARD_FEE,
  VARIANT_RETROACTIVE_DATE_MODALITIES,
} from '../../../../constants';

export const CommonQuotationSchema = object().shape({
  policyholder: object().shape({
    federalId: string()
      .required()
      .test('invalidPolicyholderFederalId', function federalIdValid() {
        const { federalId } = this.parent;
        if (!federalId) return false;
        return federalIdValidator(federalId, 'full');
      }),
    affiliateFederalId: string()
      .nullable()
      .notRequired()
      .test('invalidPolicyholderAffiliateFederalId', function federalIdValid() {
        const { affiliateFederalId } = this.parent as any;
        if (!affiliateFederalId) return true;
        return federalIdValidator(affiliateFederalId, 'full');
      }),
  }),
  modality: object().shape({
    id: number().required(),
    subModalityId: number().required(),
  }),
  validity: object().shape({
    startDate: string()
      .required()
      .test(
        'initialValidityMaxRetroactive',
        function startValidityMaxRetroactive() {
          const { startDate } = this.parent;
          const {
            quote: { modality },
          } = store.getState();
          let retroactiveDays = 1095;
          if (
            modality &&
            modality.retroactiveDays &&
            VARIANT_RETROACTIVE_DATE_MODALITIES.includes(modality.id)
          ) {
            retroactiveDays = modality.retroactiveDays;
          }
          const parsedInitialValidity = parseISO(startDate);
          const maxRetroactiveDate = startOfDay(
            subDays(new Date(), retroactiveDays),
          );
          return (
            isSameDay(parsedInitialValidity, maxRetroactiveDate) ||
            isAfter(parsedInitialValidity, maxRetroactiveDate)
          );
        },
      ),
    durationInDays: number().positive().required(),
  }),
  securedAmount: number().positive().required(),
  numberOfInstallments: number().required(),
  firstDueDate: string().optional().nullable(),
  brokerFederalId: string()
    .required()
    .test('invalidBrokerFederalId', function federalIdValid() {
      const { brokerFederalId } = this.parent;
      return federalIdValidator(brokerFederalId, 'full');
    }),
  pricing: object().when('hasUpdate', {
    is: (hasUpdate: boolean) => hasUpdate,
    then: object().shape({
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
    otherwise: object().notRequired(),
  }),
});
