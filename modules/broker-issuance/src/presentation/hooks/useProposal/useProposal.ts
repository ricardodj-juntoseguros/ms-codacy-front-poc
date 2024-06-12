/* eslint-disable consistent-return */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFlow } from '@shared/hooks';
import { AppDispatch } from '../../../config/store';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import {
  proposalActions,
  putProposal,
  canAuthorizeProposal,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { proposalAdapter } from '../../../application/features/proposal/adapters';
import {
  CustomClauseRequestedByEnum,
  ValidationTypesEnum,
} from '../../../application/types/model';
import { PROPOSAL_MODALITY_SCHEMAS } from '../../../application/validations';
import { useValidate } from '../useValidate';
import {
  patchCustomClause,
  postCustomClause,
  selectContractualCondition,
} from '../../../application/features/contractualCondition/ContractualConditionSlice';

export const useProposal = () => {
  const quote = useSelector(selectQuote);
  const proposal = useSelector(selectProposal);
  const contractualCondition = useSelector(selectContractualCondition);
  const { currentQuote, modality } = quote;
  const { hasProposalChanges, loadingProposal } = proposal;
  const {
    currentContractualCondition,
    requestedBy,
    text,
    hasContractualConditionsChanges,
  } = contractualCondition;
  const { setCurrentProposal, setCreateProposalSuccess } = proposalActions;
  const policyId = proposal.identification?.PolicyId;
  const dispatch: AppDispatch = useDispatch();
  const validate = useValidate();
  const { advanceStep } = useFlow();

  const hasUsavedContractualCondition = useMemo(
    () => !!policyId && !!requestedBy && !!text && !currentContractualCondition,
    [currentContractualCondition, policyId, requestedBy, text],
  );
  const hasContractualConditionUpdate = useMemo(
    () =>
      hasContractualConditionsChanges &&
      currentContractualCondition &&
      currentContractualCondition.id,
    [currentContractualCondition, hasContractualConditionsChanges],
  );

  const onNext = useCallback(
    (stepName: string) => {
      dispatch(setCreateProposalSuccess(false));
      advanceStep(stepName);
    },
    [advanceStep, dispatch, setCreateProposalSuccess],
  );

  const createOrUpdateContractualCondition = useCallback(
    (
      policyId: number,
      requestedBy: CustomClauseRequestedByEnum,
      text: string,
      stepName?: string,
    ) => {
      if (!currentContractualCondition) {
        return dispatch(postCustomClause({ policyId, requestedBy, text })).then(
          () => {
            dispatch(canAuthorizeProposal({ policyId }));
            if (stepName) onNext(stepName);
          },
        );
      }
      const { id: clauseId } = currentContractualCondition;
      return dispatch(
        patchCustomClause({ clauseId, isDelete: false, requestedBy, text }),
      ).then(() => {
        dispatch(canAuthorizeProposal({ policyId }));
        if (stepName) onNext(stepName);
      });
    },
    [currentContractualCondition, dispatch, onNext],
  );

  const updateProposal = useCallback(
    async (stepName?: string) => {
      if (!modality || !currentQuote) return;
      const schema = PROPOSAL_MODALITY_SCHEMAS[modality.id];
      const payload = proposalAdapter(proposal, quote);
      const isValid = await validate(
        schema,
        payload,
        ValidationTypesEnum.full,
        [],
        false,
      );
      const proposalId = currentQuote?.identification.ProposalId;
      if (!isValid) return;
      dispatch(setCurrentProposal(payload));
      if (hasProposalChanges && !loadingProposal) {
        await dispatch(putProposal({ proposalId, proposalData: payload })).then(
          async (response: any) => {
            if (
              !hasUsavedContractualCondition &&
              !hasContractualConditionUpdate
            ) {
              await dispatch(
                canAuthorizeProposal({ policyId: response.payload.PolicyId }),
              );
              if (stepName) onNext(stepName);
            }
          },
        );
      }
      if (
        policyId &&
        (hasUsavedContractualCondition || hasContractualConditionUpdate)
      ) {
        return createOrUpdateContractualCondition(
          policyId,
          requestedBy as number,
          text,
          stepName,
        );
      }
      if (stepName) onNext(stepName);
    },
    [
      createOrUpdateContractualCondition,
      currentQuote,
      dispatch,
      hasUsavedContractualCondition,
      hasContractualConditionUpdate,
      hasProposalChanges,
      loadingProposal,
      modality,
      onNext,
      policyId,
      proposal,
      quote,
      requestedBy,
      setCurrentProposal,
      text,
      validate,
    ],
  );

  return updateProposal;
};
