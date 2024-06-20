import { formatISO, parse, startOfDay } from 'date-fns';
import brLocale from 'date-fns/locale/pt-BR';
import { BrokerPlatformAuthService } from '@services';
import { parseStringToDate } from '@shared/utils';
import { QuotationDTO } from '../../../types/dto';
import {
  AdditionalCoverageModel,
  PolicyRenewalModel,
  PolicyRenewalTypeEnum,
  QuoteModel,
} from '../../../types/model';

export const quotationAdapter = (
  quote: QuoteModel,
  policyRenewal: PolicyRenewalModel,
  additionalCoverage: AdditionalCoverageModel,
  firstDueDate: string | null,
  numberOfInstallments: number | null,
  isUpdate: boolean,
): QuotationDTO => {
  const {
    policyholder,
    policyholderAffiliate,
    modality,
    submodality,
    startDateValidity,
    durationInDays,
    securedAmount,
    proposalFee,
    commissionFlex,
    feeFlex,
    toggleRateFlex,
    isPolicyInProgress,
    isQuoteResume,
  } = quote;
  const { isPolicyRenewal, policyRenewalType, mainPolicyNumber } =
    policyRenewal;
  const { labor: useCoverageLabor, rateAggravation } = additionalCoverage;
  const firstDueDateFormatted = firstDueDate
    ? parseStringToDate(firstDueDate)
    : null;

  const brokerFederalId = BrokerPlatformAuthService.getBroker()?.federalId;
  let basePayload = {
    policyholder: {
      federalId: policyholder
        ? policyholder.federalId.replace(/[^\d]+/g, '')
        : undefined,
      affiliateFederalId:
        policyholderAffiliate && policyholderAffiliate.id !== 0
          ? policyholderAffiliate.federalId.replace(/[^\d]+/g, '')
          : null,
    },
    modality: {
      id: modality?.id,
      subModalityId: submodality?.id,
    },
    validity: {
      startDate: startDateValidity
        ? formatISO(
            startOfDay(
              parse(startDateValidity, 'dd/MM/yyyy', new Date(), {
                locale: brLocale,
              }),
            ),
          )
        : undefined,
      durationInDays: Number.isNaN(durationInDays) ? undefined : durationInDays,
    },
    securedAmount: Number.isNaN(securedAmount) ? undefined : securedAmount,
    numberOfInstallments:
      isUpdate && numberOfInstallments ? numberOfInstallments : 1,
    firstDueDate: firstDueDateFormatted
      ? firstDueDateFormatted.toISOString()
      : null,
    additionalCoverage: {
      labor: useCoverageLabor,
      rateAggravation,
    },
    brokerFederalId,
  } as QuotationDTO;

  if (isUpdate) {
    basePayload = {
      ...basePayload,
      isQuotationRetake: isQuoteResume,
      pricing: {
        proposalFee: proposalFee || null,
        commissionFlex: (toggleRateFlex && commissionFlex) || null,
        feeFlex: (toggleRateFlex && feeFlex) || null,
      },
    };
  }

  if (isPolicyInProgress || isPolicyRenewal) {
    basePayload = {
      ...basePayload,
      renewal: {
        isPolicyInProgress: isPolicyInProgress || isPolicyRenewal,
        type: policyRenewalType || PolicyRenewalTypeEnum.Undefined,
        mainPolicyNumber: mainPolicyNumber || '',
      },
    };
  }

  return basePayload;
};
