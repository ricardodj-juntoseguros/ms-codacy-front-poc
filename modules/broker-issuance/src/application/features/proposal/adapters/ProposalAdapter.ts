import { BrokerPlatformAuthService } from '@services';
import { parseStringToDate } from '@shared/utils';
import { ProposalDTO } from '../../../types/dto';
import { ProposalModel } from '../../../types/model/ProposalModel';
import { QuoteModel } from '../../../types/model';

export const proposalAdapter = (
  proposal: ProposalModel,
  quote: QuoteModel,
): ProposalDTO => {
  const {
    insured,
    insuredAddress,
    biddingNumber,
    biddingDescription,
    firstDueDate,
    paymentType,
    numberOfInstallments,
    comments,
  } = proposal;
  const { currentQuote, submodality } = quote;

  const brokerFederalId = BrokerPlatformAuthService.getBroker()?.federalId;

  const defaultPaymentType =
    submodality && submodality.payments.length === 1
      ? submodality.payments[0].id
      : 1;

  const parsedFirstDueDate = firstDueDate
    ? parseStringToDate(firstDueDate)
    : null;

  return {
    insured: {
      id: insured ? insured.insuredId : 0,
      federalId: insured ? insured.federalId : '',
      addressId: insuredAddress ? insuredAddress.addressId : 0,
    },
    selectedInstallmentOptions: {
      numberOfInstallments:
        numberOfInstallments ||
        currentQuote?.installmentOptions[0].numberOfInstallments ||
        1,
      paymentType: paymentType || defaultPaymentType,
      firstDueDate:
        (parsedFirstDueDate && parsedFirstDueDate.toISOString()) ||
        currentQuote?.installmentOptions[0].firstDueDate ||
        '',
    },
    brokerFederalId: brokerFederalId || '',
    biddingNumber,
    biddingDescription,
    contacts: [],
    observations: comments,
  };
};
