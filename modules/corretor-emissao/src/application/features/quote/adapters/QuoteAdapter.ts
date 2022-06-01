import { formatISO, parse } from 'date-fns';
import { QuoteDTO } from '../../../types/dto/QuoteDTO';
import { QuoteModel } from '../../../types/model';

export const quoteAdapter = (quote: QuoteModel): QuoteDTO => {
  const {
    policyholder,
    modality,
    coverageData,
    submodality,
    subsidiary,
    pricing,
  } = quote;

  return {
    policyHolder: {
      federalId: policyholder ? policyholder.federalId : '',
      affiliateFederalId: subsidiary ? subsidiary.federalId : '',
    },
    modality: {
      id: modality ? modality.externalId : 0,
      subModalityId: submodality ? submodality.id : 1,
    },
    validity: {
      startDate: formatISO(
        parse(coverageData.startDate, 'dd/MM/yyyy', new Date()),
      ),
      durationInDays: coverageData.durationInDays,
    },
    securedAmount: coverageData.securedAmount,
    commissionFlex:
      pricing.commissionFlex &&
      pricing.commissionFlex !== pricing.comissionValue
        ? pricing.commissionFlex
        : null,
    feeFlex:
      pricing.feeFlex &&
      pricing.feeFlex !== pricing.proposalFee &&
      pricing.feeFlex !== pricing.feeStandard
        ? pricing.feeFlex
        : null,
    proposalFee: pricing.proposalFee !== 0 ? pricing.proposalFee : null,
    numberOfInstallments: 5,
    originSystemId: 5,
    documentType: 1,
    additionalCoverage: {
      labor: false,
      vigilance: false,
      guarantee: false,
    },
  };
};
