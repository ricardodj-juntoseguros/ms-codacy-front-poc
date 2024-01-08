import { BrokerPlatformAuthService } from "@services";
import { parseStringToDate } from "@shared/utils";
import { ProposalDTO } from "../../../types/dto"
import { ProposalModel } from "../../../types/model/ProposalModel"
import { QuoteModel } from "../../../types/model";

export const proposalAdapter = (proposal: ProposalModel, quote: QuoteModel): ProposalDTO => {
  const { insured, insuredAddress, biddingNumber, biddingDescription, firstDueDate, paymentType, numberOfInstallments, comments } = proposal;
  const { currentQuote, submodality } = quote;
  const brokerFederalId = BrokerPlatformAuthService.getBroker()?.federalId;
  const defaultPaymentType = submodality && submodality.payments.length === 1 ? submodality.payments[0].id : 1;
  const firstDueDateFormatted = firstDueDate ? parseStringToDate(firstDueDate) : null;
  return {
    insured: {
      federalId: insured ? insured.federalId : '',
      addressId: insuredAddress ? insuredAddress.addressId : 0
    },
    selectedInstallmentOptions: {
      numberOfInstallments: Number(numberOfInstallments?.value) || currentQuote?.installmentOptions[0].numberOfInstallments || 0,
      paymentType: Number(paymentType?.value) || defaultPaymentType,
      firstDueDate: (firstDueDateFormatted && firstDueDateFormatted.toISOString()) || currentQuote?.installmentOptions[0].firstDueDate || ''
    },
    brokerFederalId: brokerFederalId || '',
    biddingNumber,
    biddingDescription,
    contacts: [],
    observations: comments
  }
}
