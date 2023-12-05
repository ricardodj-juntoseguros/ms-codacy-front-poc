import { number, object } from 'yup';
import { CreateQuotationSchema } from './CreateQuotation';
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
      commissionFlex: number().nullable().notRequired(),
      feeFlex: number().nullable().notRequired(),
    }),
  }),
);
