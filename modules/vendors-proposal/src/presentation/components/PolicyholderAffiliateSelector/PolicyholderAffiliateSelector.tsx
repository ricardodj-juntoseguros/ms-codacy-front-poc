import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, DropdownOptions } from 'junto-design-system';
import { federalIdFormatter } from '@shared/utils';
import {
  selectProposal,
  proposalActions,
} from '../../../application/features/proposal/ProposalSlice';
import { PolicyholderAffiliateDTO } from '../../../application/types/dto';
import { selectInsuredAndPolicyholderSelection } from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionSlice';

const PolicyholderAffiliateSelector: React.FC = () => {
  const dispatch = useDispatch();
  const {
    policyholder: { affiliateId },
  } = useSelector(selectProposal);
  const { policyholderAffiliateResults } = useSelector(
    selectInsuredAndPolicyholderSelection,
  );

  const formatAffiliateLabel = (affiliate?: PolicyholderAffiliateDTO) => {
    if (!affiliate) return '';
    const { city, state, federalId } = affiliate;
    return `${city} - ${state} - CNPJ: ${federalIdFormatter(
      federalId.replace(/[^\d]+/g, ''),
    )}`;
  };

  const handleAffiliateSelect = (option: DropdownOptions) => {
    const { value } = option;
    const affiliate = policyholderAffiliateResults?.find(
      aff => aff.id === Number.parseInt(value, 10),
    );
    if (affiliate)
      dispatch(
        proposalActions.setPolicyholderAffiliateValues({
          id: affiliate.id,
          federalId: affiliate.federalId.replace(/[^\d]+/g, ''),
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
        affiliateId
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
