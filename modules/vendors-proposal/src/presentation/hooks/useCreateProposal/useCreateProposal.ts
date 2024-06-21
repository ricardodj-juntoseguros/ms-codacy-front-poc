import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProposalSchema } from '../../../application/validations/schemas';
import { proposalAdapter } from '../../../application/features/proposal/adapters';
import {
  createProposal,
  proposalActions,
  selectProposal,
  updateProposal,
  // updateProposal,
} from '../../../application/features/proposal/ProposalSlice';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';
import { selectInsuredAndPolicyholderSelection } from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionSlice';
import { ERROR_MESSAGES } from '../../../constants';
import { useValidate } from '../useValidate';
import { ValidationErrorModel } from '../../../application/types/model';

export function useCreateProposal() {
  const validate = useValidate();
  const dispatch = useDispatch();
  const proposal = useSelector(selectProposal);
  const { policyholderInputValue } = useSelector(
    selectInsuredAndPolicyholderSelection,
  );

  const checkPolicyholder = useCallback(async () => {
    return InsuredAndPolicyholderSelectionApi.getPolicyholders(
      proposal.policyholder.federalId ||
        policyholderInputValue.replace(/[^\d]+/g, ''),
    )
      .then(async result => {
        if (result[0].corporateName !== null) {
          dispatch(
            proposalActions.setPolicyholder({
              ...proposal.policyholder,
              corporateName: result[0].corporateName,
            }),
          );
          return { success: true, errors: {} as any };
        }
        return {
          success: false,
          errors: {
            policyholderInputValue: [ERROR_MESSAGES.policyholderRegister],
          },
        };
      })
      .catch(() => {
        return {
          success: false,
          errors: {
            policyholderInputValue: [ERROR_MESSAGES.policyholderRegister],
          },
        };
      });
  }, [dispatch, proposal.policyholder, policyholderInputValue]);

  const postProposal = useCallback(async (): Promise<{
    success: boolean;
    errors: ValidationErrorModel;
  }> => {
    const proposalPayload = proposalAdapter(
      proposal,
      policyholderInputValue.replace(/[^\d]+/g, ''),
    );

    const isValidForm = await validate(ProposalSchema, proposalPayload);
    if (!isValidForm) return { success: false, errors: {} };

    const policyholderExists = await checkPolicyholder();
    if (!policyholderExists.success) return policyholderExists;

    if (!proposal.identification) {
      await dispatch(createProposal(proposalPayload));
    } else {
      await dispatch(
        updateProposal({
          proposalId: proposal.identification.proposalId,
          payload: proposalPayload,
        }),
      );
    }

    return { success: true, errors: {} };
  }, [checkPolicyholder, dispatch, proposal, validate, policyholderInputValue]);

  return postProposal;
}
