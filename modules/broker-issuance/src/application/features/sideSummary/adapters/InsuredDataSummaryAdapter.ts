import { federalIdFormatter } from '@shared/utils';
import {
  CustomClauseRequestedByEnum,
  InsuredModel,
} from '../../../types/model';
import { InsuredAddressModel } from '../../../types/model/InsuredAddressModel';

export const insuredDataSummaryAdapter = (
  insured: InsuredModel | null,
  insuredAddress: InsuredAddressModel | null,
  biddingNumber: string,
  biddingDescription: string,
  openContractualConditions: boolean,
  contractualConditionsRequestedBy: CustomClauseRequestedByEnum | null,
  specialAnalysisRequired: boolean,
) => {
  const result = [] as { key: string; label: string; value: string }[];

  if (insured) {
    if (insured.federalId) {
      result.push({
        key: 'insuredFederalId',
        label: 'CNPJ',
        value: federalIdFormatter(insured.federalId),
      });
    }
    result.push({
      key: 'insuredName',
      label: 'Razão Social',
      value: insured.name,
    });
  }
  if (insuredAddress) {
    result.push({
      key: 'insuredAddress',
      label: 'Endereço',
      value: insuredAddress.label,
    });
  }
  if (biddingNumber && biddingNumber.trim().length > 0) {
    result.push({
      key: 'biddingNumber',
      label: 'Número do Edital',
      value: biddingNumber,
    });
  }
  if (biddingDescription && biddingDescription.trim().length > 0) {
    result.push({
      key: 'biddingDescription',
      label: 'Anexo do Edital',
      value: biddingDescription,
    });
  }
  if (openContractualConditions) {
    let requestedByLabel = '';
    if (contractualConditionsRequestedBy) {
      requestedByLabel =
        contractualConditionsRequestedBy ===
        CustomClauseRequestedByEnum.POLICYHOLDER
          ? '(Tomador)'
          : '(Segurado)';
    }
    result.push({
      key: 'contractualConditions',
      label: 'Condições',
      value: `Novo ou modificado ${requestedByLabel}`,
    });
  }
  result.push({
    key: 'specialAnalysisRequired',
    label: 'Particularidades na proposta',
    value: specialAnalysisRequired ? 'Sim' : 'Não',
  });
  return result;
};
