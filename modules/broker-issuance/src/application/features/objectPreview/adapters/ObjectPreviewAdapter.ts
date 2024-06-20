import { format } from 'date-fns';
import { parseStringToDate } from '@shared/utils';
import {
  AdditionalCoverageModel,
  PolicyRenewalModel,
  QuoteModel,
} from '../../../types/model';
import { ProposalModel } from '../../../types/model/ProposalModel';
import { ObjectPreviewDTO } from '../../../types/dto';

export const objectPreviewAdapter = (
  quote: QuoteModel,
  proposal: ProposalModel,
  additionalCoverage: AdditionalCoverageModel,
  policyRenewal: PolicyRenewalModel,
): ObjectPreviewDTO | null => {
  const {
    policyholder,
    policyholderAffiliate,
    modality,
    securedAmount,
    startDateValidity,
    endDateValidity,
    currentQuote,
    isPolicyInProgress,
  } = quote;
  const { identification, insured, biddingNumber, biddingDescription } =
    proposal;
  const { labor } = additionalCoverage;
  const { isPolicyRenewal, policyRenewalType, mainPolicyNumber, documentList } =
    policyRenewal;
  const renewalDocumentsFiltered = documentList.filter(
    document => document.active,
  );

  if (!identification?.PolicyId) return null;
  return {
    identification: {
      policyId: identification.PolicyId,
    },
    policyholder: {
      federalId: policyholder?.federalId,
      ...(policyholderAffiliate &&
        policyholderAffiliate.federalId.length !== 0 && {
          affiliateFederalId: policyholderAffiliate.federalId.replace(
            /[^\d]+/g,
            '',
          ),
        }),
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
      startDate:
        startDateValidity &&
        format(parseStringToDate(startDateValidity), 'yyyy-MM-dd'),
      endDate:
        endDateValidity &&
        format(parseStringToDate(endDateValidity), 'yyyy-MM-dd'),
      totalPrize: currentQuote?.totalPrize,
    },
    additionalCoverage: {
      labor,
    },
    renewal: {
      isPolicyInProgress: isPolicyInProgress || isPolicyRenewal,
      type: policyRenewalType,
      mainPolicyNumber,
      documentList: renewalDocumentsFiltered.map(document => ({
        type: document.id,
        hasOrdinaryNumbering: document.hasOrdinaryNumbering,
        number: document.inputValue,
      })),
    },
  };
};
