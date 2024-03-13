import { federalIdValidator } from '@shared/utils';
import { isAfter, isBefore, isSameDay, parse, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { array, number, object, string } from 'yup';
import { getMaxFirstDueDate, getMinFirstDueDate } from '../../../../helpers';
import { store } from '../../../../config/store';

export const CommonProposalSchema = object().shape({
  insured: object().shape({
    id: number().required().min(1),
    addressId: number().required().min(1),
  }),
  selectedInstallmentOptions: object().shape({
    numberOfInstallments: number().required().min(1),
    paymentType: number().required(),
    firstDueDate: string()
      .test('invalidFirstDueDate', function validateFirstDueDate() {
        const { firstDueDate } = this.parent;
        const {
          quote: { endDateValidity },
        } = store.getState();
        const maxDate = getMaxFirstDueDate(endDateValidity);
        const minDate = getMinFirstDueDate(endDateValidity);
        const parsedFirstDueDate = startOfDay(
          parse(firstDueDate.split('T')[0], 'yyyy-MM-dd', new Date(), {
            locale: ptBR,
          }),
        );
        return (
          isSameDay(parsedFirstDueDate, minDate) ||
          isSameDay(parsedFirstDueDate, maxDate) ||
          (isAfter(parsedFirstDueDate, minDate) &&
            isBefore(parsedFirstDueDate, maxDate))
        );
      })
      .required(),
  }),
  brokerFederalId: string()
    .required()
    .test('invalidBrokerFederalId', function federalIdValid() {
      const { brokerFederalId } = this.parent;
      if (!brokerFederalId) return false;
      return federalIdValidator(brokerFederalId, 'full');
    }),
  biddingNumber: string()
    .required()
    .test('maxBiddingNumber', function maxBiddingNumber() {
      const { biddingNumber } = this.parent;
      return biddingNumber.length < 500;
    }),
  biddingDescription: string().nullable().notRequired(),
  contacts: array().nullable().notRequired(),
  obeservation: string().nullable().notRequired(),
});
