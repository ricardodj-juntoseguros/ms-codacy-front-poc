import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, DropdownOptions } from 'junto-design-system';
import { federalIdFormatter, stringToInt } from '@shared/utils';
import { NO_AFFILIATE_OPTION } from '../../../constants';
import {
  selectProposal,
  proposalActions,
} from '../../../application/features/proposal/ProposalSlice';
import { PolicyholderAffiliateDTO } from '../../../application/types/dto';
import { AppDispatch } from '../../../config/store';
import { selectInsuredAndPolicyholderSelection } from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionSlice';

const PolicyholderAffiliateSelector: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    policyholder: { affiliateId, affiliateFederalId },
  } = useSelector(selectProposal);
  const { policyholderAffiliateResults } = useSelector(
    selectInsuredAndPolicyholderSelection,
  );

  const formatAffiliateLabel = (affiliate?: PolicyholderAffiliateDTO) => {
    if (!affiliate) return '';
    if (affiliate.federalId === NO_AFFILIATE_OPTION.federalId) {
      return NO_AFFILIATE_OPTION.federalId;
    }

    const { city, state, federalId } = affiliate;
    return `${city} - ${state} - CNPJ: ${federalIdFormatter(
      federalId.replace(/[^\d]+/g, ''),
    )}`;
  };

  const handleAffiliateSelect = (option: DropdownOptions) => {
    const { value } = option;
    const affiliate = policyholderAffiliateResults?.find(
      aff => aff.id === stringToInt(value),
    );
    const formatedAffiliateFederalId =
      affiliate?.id === 0
        ? affiliate?.federalId
        : affiliate?.federalId.replace(/[^\d]+/g, '');

    if (affiliate)
      dispatch(
        proposalActions.setPolicyholderAffiliateValues({
          id: affiliate.id,
          federalId: formatedAffiliateFederalId || '',
        }),
      );
  };

  const getDropdownOptions = () => {
    if (!policyholderAffiliateResults) return [];
    return policyholderAffiliateResults.map(polAffiliate => ({
      value: `${polAffiliate.id}`,
      label: formatAffiliateLabel(polAffiliate),
    }));
  };

  return (
    <Dropdown
      data-testid="policyholderAffiliateSelector-input-dropdown"
      label="Selecione a filial"
      placeholder="Selecione uma opção"
      options={getDropdownOptions()}
      value={
        affiliateId || affiliateFederalId === NO_AFFILIATE_OPTION.federalId
          ? {
              value: `${affiliateId}`,
              label: formatAffiliateLabel(
                policyholderAffiliateResults?.find(
                  aff => aff.id === affiliateId,
                ),
              ),
            }
          : null
      }
      onValueSelected={v => handleAffiliateSelect(v)}
    />
  );
};

export default PolicyholderAffiliateSelector;
