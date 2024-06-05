import { format } from "date-fns";
import { parseStringToDate } from "@shared/utils";
import { QuoteModel } from "../../../types/model";
import { ProposalModel } from "../../../types/model/ProposalModel";
import { ObjectPreviewDTO } from "../../../types/dto";

export const objectPreviewAdapter = (quote: QuoteModel, proposal: ProposalModel): ObjectPreviewDTO | null => {
  const { policyholder, policyholderAffiliate, modality, securedAmount, startDateValidity, endDateValidity, currentQuote } = quote;
  const { identification, insured, biddingNumber, biddingDescription } = proposal;
  if (!identification?.PolicyId) return null;
  return {
    identification: {
      policyId: identification.PolicyId,
    },
    policyholder: {
      federalId: policyholder?.federalId,
      ...(policyholderAffiliate && policyholderAffiliate.federalId.length !== 0 && { affiliateFederalId: policyholderAffiliate.federalId.replace(/[^\d]+/g, '') }),
      economicGroupId: policyholder?.economicGroupId,
      economicGroupName: policyholder?.economicGroupName,
    },
    insured: {
      federalId: insured?.federalId,
      name: insured?.name,
      type: insured?.type,
    },
    modality: {
      modalityId: modality?.id,
      description: modality?.description,
      submodality: {
        submodalityId: modality?.submodalities[0].id,
        description: modality?.submodalities[0].description,
      },
    },
    proposal: {
      biddingNumber,
      biddingDescription,
      securedAmount,
      startDate: startDateValidity && format(parseStringToDate(startDateValidity), 'yyyy-MM-dd'),
      endDate: endDateValidity && format(parseStringToDate(endDateValidity), 'yyyy-MM-dd'),
      totalPrize: currentQuote?.totalPrize,
    }
  }
};
