import { federalIdValidator } from "@shared/utils";
import { array, number, object, string } from "yup";

export const CommonProposalSchema = object().shape({
  insured: object().shape({
    federalId: string()
      .required()
      .test('invalidInsuredFederalId', function federalIdValid() {
        const { federalId } = this.parent;
        if (!federalId) return false;
        return federalIdValidator(federalId, 'full');
      }),
    addressId: number().required(),
  }),
  selectedInstallmentOptions: object().shape({
    numberOfInstallments: number().required().min(1),
    paymentType: number().required(),
    firstDueDate: string().required(),
  }),
  brokerFederalId: string().required().test('invalidBrokerFederalId', function federalIdValid() {
    const { brokerFederalId } = this.parent;
    if (!brokerFederalId) return false;
    return federalIdValidator(brokerFederalId, 'full');
  }),
  biddingNumber: string().required(),
  biddingDescription: string().nullable().notRequired(),
  contacts: array().nullable().notRequired(),
  obeservation: string().nullable().notRequired(),
});
