/* eslint-disable consistent-return */
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectQuote } from "../../../application/features/quote/QuoteSlice";
import { putProposal, selectProposal } from "../../../application/features/proposal/ProposalSlice";
import { proposalAdapter } from "../../../application/features/proposal/adapters";
import { ValidationTypesEnum } from "../../../application/types/model";
import { PROPOSAL_MODALITY_SCHEMAS } from "../../../application/validations";
import { useValidate } from "../useValidate";
import { patchCustomClause, postCustomClause, selectContractualCondition } from "../../../application/features/contractualCondition/ContractualConditionSlice";

export const useProposal = () => {
  const quote = useSelector(selectQuote);
  const proposal = useSelector(selectProposal);
  const contractualCondition = useSelector(selectContractualCondition);
  const { currentQuote, modality } = quote;
  const { hasProposalChanges } = proposal
  const policyId = proposal.identification?.PolicyId;
  const dispatch = useDispatch();
  const validate = useValidate();

  const createOrUpdateContractualCondition = useCallback(() => {
    const { currentContractualCondition, requestedBy, text, hasContractualConditionsChanges } = contractualCondition;
    if (!policyId || !requestedBy || !text) return;
    if (!currentContractualCondition) return dispatch(postCustomClause({ policyId, requestedBy, text }));
    const { id: clauseId } = currentContractualCondition;
    if (hasContractualConditionsChanges && clauseId) {
      return dispatch(patchCustomClause({ clauseId, isDelete: false, requestedBy, text }));
    }
  }, [contractualCondition, dispatch, policyId]);

  const updateProposal = useCallback(async () => {
    if (!modality || !currentQuote) return;
    const schema = PROPOSAL_MODALITY_SCHEMAS[modality.id];
    const payload = proposalAdapter(proposal, quote);
    const isValid = await validate(schema, payload, ValidationTypesEnum.full, [], false);
    const proposalId = currentQuote?.identification.ProposalId;
    if (isValid) {
      if (hasProposalChanges) dispatch(putProposal({ proposalId, proposalData: payload }));
      createOrUpdateContractualCondition();
      return true;
    };
    return false;
  }, [createOrUpdateContractualCondition, currentQuote, dispatch, hasProposalChanges, modality, proposal, quote, validate]);

  return updateProposal;
}
