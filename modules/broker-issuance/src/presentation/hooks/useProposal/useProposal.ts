/* eslint-disable consistent-return */
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectQuote } from "../../../application/features/quote/QuoteSlice";
import { putProposal, selectProposal } from "../../../application/features/proposal/ProposalSlice";
import { proposalAdapter } from "../../../application/features/proposal/adapters";
import { ValidationTypesEnum } from "../../../application/types/model";
import { PROPOSAL_MODALITY_SCHEMAS } from "../../../application/validations";
import { useValidate } from "../useValidate";

export const useProposal = () => {
  const quote = useSelector(selectQuote);
  const proposal = useSelector(selectProposal);
  const dispatch = useDispatch();
  const validate = useValidate();

  const updateProposal = useCallback(async () => {
    if (!quote.modality || !quote.currentQuote) return;
    const schema = PROPOSAL_MODALITY_SCHEMAS[quote.modality.id];
    const payload = proposalAdapter(proposal, quote);
    const isValid = await validate(schema, payload, ValidationTypesEnum.full, [], false);
    const proposalId = quote.currentQuote?.identification.ProposalId;
    if (isValid) {
      await dispatch(putProposal({ proposalId, proposalData: payload }));
      return true;
    };
    return false;
  }, [dispatch, proposal, quote, validate]);

  return updateProposal;
}
