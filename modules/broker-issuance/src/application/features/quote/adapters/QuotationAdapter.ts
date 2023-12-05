import { formatISO, parse, startOfDay } from 'date-fns';
import brLocale from 'date-fns/locale/pt-BR';
import { BrokerPlatformAuthService } from '@services';
import { QuotationDTO } from '../../../types/dto';
import { QuoteModel } from '../../../types/model';

export const quotationAdapter = (
  quote: QuoteModel,
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
    hasAdditionalCoverageLabor,
    proposalFee,
  } = quote;

  const brokerFederalId = BrokerPlatformAuthService.getBroker()?.federalId;
  let basePayload = {
    policyholder: {
      federalId: policyholder
        ? policyholder.federalId.replace(/[^\d]+/g, '')
        : undefined,
      affiliateFederalId: policyholderAffiliate
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
    numberOfInstallments: 1,
    additionalLaborCoverage: hasAdditionalCoverageLabor || false,
    brokerFederalId,
  } as QuotationDTO;

  if (isUpdate) {
    basePayload = {
      ...basePayload,
      pricing: {
        proposalFee: proposalFee || null,
        commissionFlex: null,
        feeFlex: null,
      },
    };
  }

  return basePayload;
};
