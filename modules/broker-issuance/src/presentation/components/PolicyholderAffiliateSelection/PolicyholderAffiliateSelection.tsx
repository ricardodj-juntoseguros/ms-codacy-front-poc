import { ChatUtils } from '@shared/utils';
import { Alert, Dropdown } from 'junto-design-system';
import { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPolicyholder } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import {
  quoteSliceActions,
  selectQuote,
} from '../../../application/features/quote/QuoteSlice';
import { PolicyholderAffiliatesModel } from '../../../application/types/model';
import { AppDispatch } from '../../../config/store';
import { AFFILIATE_DEFAULT_OPTIONS } from '../../../constants';
import { useQuotation } from '../../hooks';

interface PolicyholderAffiliateSelectionProps {
  loadingPolicyholderDetails: boolean;
}

const PolicyholderAffiliateSelection: FunctionComponent<PolicyholderAffiliateSelectionProps> =
  ({ loadingPolicyholderDetails }) => {
    const dispatch = useDispatch<AppDispatch>();
    const createOrUpdateQuotation = useQuotation();
    const { affiliatesOptions } = useSelector(selectPolicyholder);
    const { policyholderAffiliate, currentQuote } = useSelector(selectQuote);
    const { setPolicyholderAffiliate } = quoteSliceActions;

    useEffect(() => {
      if (currentQuote && currentQuote.totalPrize) {
        createOrUpdateQuotation();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyholderAffiliate]);

    const renderNotFoundAffiliateAlert = () => {
      const { label } = AFFILIATE_DEFAULT_OPTIONS.notFoundAffiliate;
      if (policyholderAffiliate?.label === label) {
        return (
          <Alert
            fullWidth
            data-testid="policyholderSelection-not-found-affiliate-alert"
            variant="neutral"
            arrow="top-start"
            text="Seguiremos sua proposta com os dados da Matriz. Caso necessite cadastrar uma nova filial, entre em contato %ACTION_BUTTON%"
            actionButtonText="via chat."
            onActionButtonClick={() => ChatUtils.zenDesk.open()}
          />
        );
      }
      return null;
    };

    const handlePolicyholderAffiliateSelected = (
      optionSelected: PolicyholderAffiliatesModel,
    ) => {
      dispatch(setPolicyholderAffiliate(optionSelected));
    };

    return (
      <>
        <Dropdown
          id="policyholderAndModality-input-dropdown"
          data-testid="policyholderAndModality-input-dropdown"
          label="Selecione a filial (opcional)"
          placeholder="Selecione uma opção"
          options={affiliatesOptions}
          value={policyholderAffiliate}
          onValueSelected={handlePolicyholderAffiliateSelected}
          disabled={affiliatesOptions.length === 0}
          loading={loadingPolicyholderDetails}
        />
        {renderNotFoundAffiliateAlert()}
      </>
    );
  };

export default PolicyholderAffiliateSelection;
