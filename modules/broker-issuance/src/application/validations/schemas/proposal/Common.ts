import { federalIdValidator } from "@shared/utils";
import { addDays, isBefore } from "date-fns";
import { array, number, object, string } from "yup";
import { MAX_DAYS_FOR_FIRST_DUE_DATE } from "../../../../constants";

export const CommonProposalSchema = object().shape({
  insured: object().shape({
    federalId: string()
      .required()
      .test('invalidInsuredFederalId', function federalIdValid() {
        const { federalId } = this.parent;
        if (!federalId) return false;
        return federalIdValidator(federalId, 'full');
      }),
    addressId: number().required().min(1),
  }),
  selectedInstallmentOptions: object().shape({
    numberOfInstallments: number().required().min(1),
    paymentType: number().required(),
    firstDueDate: string().required().test('invalidFirstDueDate', function validateFirstDueDate() {
      const { durationInDays, firstDueDate } = this.parent;
      const daysToAdd =
        durationInDays && durationInDays < MAX_DAYS_FOR_FIRST_DUE_DATE ? durationInDays : MAX_DAYS_FOR_FIRST_DUE_DATE;
      const maxDate = addDays(new Date(), daysToAdd);
      return isBefore(new Date(firstDueDate), maxDate);
    }),
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
