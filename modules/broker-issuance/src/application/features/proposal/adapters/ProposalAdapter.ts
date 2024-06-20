import { BrokerPlatformAuthService } from '@services';
import { parseStringToDate } from '@shared/utils';
import { ProposalDTO } from '../../../types/dto';
import { ProposalModel } from '../../../types/model/ProposalModel';
import { PolicyRenewalModel, QuoteModel } from '../../../types/model';

export const proposalAdapter = (
  proposal: ProposalModel,
  quote: QuoteModel,
  policyRenewal: PolicyRenewalModel,
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
    specialAnalysisRequired,
    specialAnalysisDescription,
  } = proposal;
  const { currentQuote, submodality, isPolicyInProgress } = quote;
  const { isPolicyRenewal, mainPolicyNumber, policyRenewalType, documentList } =
    policyRenewal;

  const brokerFederalId = BrokerPlatformAuthService.getBroker()?.federalId;

  const defaultPaymentType =
    submodality && submodality.payments.length === 1
      ? submodality.payments[0].id
      : 1;

  const parsedFirstDueDate = firstDueDate
    ? parseStringToDate(firstDueDate)
    : null;

  const renewalDocumentList = documentList.map(document => {
    if (!document.active) return null;
    return {
      type: document.id,
      number: document.inputValue,
      hasOrdinaryNumbering: document.hasOrdinaryNumbering,
    };
  });

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
    specialAnalysis: {
      required: specialAnalysisRequired,
      description: specialAnalysisDescription,
    },
    renewal: {
      isPolicyInProgress: isPolicyInProgress || isPolicyRenewal,
      type: policyRenewalType,
      mainPolicyNumber,
      documentList: renewalDocumentList.filter(
        document => document !== null,
      ) as ProposalDTO['renewal']['documentList'],
    },
  };
};
