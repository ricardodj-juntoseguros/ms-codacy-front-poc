import { format, formatISO, parse } from 'date-fns';
import { parseStringToDate } from '@shared/utils';
import {
  CONVENTIONAL_SUBMODALITY,
  NO_AFFILIATE_OPTION,
} from '../../../../constants';
import { ModalityDTO, ProposalDTO } from '../../../types/dto';
import { ProposalModel } from '../../../types/model';

export const proposalAdapter = (
  proposal: ProposalModel,
  policyholderInputValue: string,
): ProposalDTO => {
  const securedAmount = Number(
    ((proposal.contractValue / 100) * proposal.warrantyPercentage).toFixed(2),
  );

  const subModalityId = getSubmodalityId(
    proposal.modality,
    proposal.additionalCoverageLabor,
  );

  return {
    policyholderFederalId: proposal.policyholder.federalId
      ? proposal.policyholder.federalId
      : policyholderInputValue,
    ...(proposal.policyholder.affiliateFederalId &&
      proposal.policyholder.affiliateFederalId !==
        NO_AFFILIATE_OPTION.federalId && {
        policyholderAffiliateFederalId:
          proposal.policyholder.affiliateFederalId,
      }),
    biddingNumber: proposal.contractNumber,
    insuredId: proposal.insuredId,
    insuredFederalId: proposal.insuredFederalId,
    insuredAddressId: proposal.insuredAddressId,
    modalityId: proposal.modality.modalityId,
    subModalityId,
    validityStartDate: formatISO(
      parse(
        format(parseStringToDate(proposal.initialValidity), 'yyyy/MM/dd'),
        'yyyy/MM/dd',
        new Date(),
      ),
    ),
    validityDurationInDays: proposal.validityInDays,
    securedAmount,
    additionalLaborCoverage: proposal.additionalCoverageLabor,
    contacts: [proposal.policyholderContact.email],
  };
};

const getSubmodalityId = (
  modality: ModalityDTO,
  additionalLaborCoverage: boolean,
) => {
  const { submodalities } = modality;
  const submodality = submodalities.find(
    sub => sub.additionalCoverage === additionalLaborCoverage,
  );
  return submodality ? submodality.subModalityId : CONVENTIONAL_SUBMODALITY;
};
