import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProposalSchema } from '../../../application/validations/schemas';
import { proposalAdapter } from '../../../application/features/proposal/adapters';
import {
  createProposal,
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';
import { VALIDATION_MESSAGES } from '../../../constants';
import { useValidate } from '../useValidate';
import { ValidationErrorModel } from '../../../application/types/model';

export function useCreateProposal() {
  const validate = useValidate();
  const dispatch = useDispatch();
  const proposal = useSelector(selectProposal);

  const checkPolicyholder = useCallback(async () => {
    return InsuredAndPolicyholderSelectionApi.getPolicyholders(
      proposal.policyholder.federalId,
    )
      .then(async result => {
        if (result[0].corporateName !== '') {
          dispatch(
            proposalActions.setPolicyholder({
              ...proposal.policyholder,
              corporateName: result[0].corporateName,
            }),
          );
        }
        return { success: true, errors: {} };
      })
      .catch(error => {
        const errorMessage =
          error && error.data && error.data.data && error.data.data.message
            ? error.data.data[0].message
            : VALIDATION_MESSAGES.policyholderRegister;
        return {
          success: false,
          errors: { policyholderInputValue: errorMessage },
        };
      });
  }, [dispatch, proposal.policyholder]);

  const postProposal = useCallback(async (): Promise<{
    success: boolean;
    errors: ValidationErrorModel;
  }> => {
    const proposalPayload = proposalAdapter(proposal);

    const isValidForm = await validate(ProposalSchema, proposalPayload);
    if (!isValidForm) return { success: false, errors: {} };

    const policyholderExists = await checkPolicyholder();
    if (!policyholderExists.success) return policyholderExists;

    await dispatch(createProposal(proposalPayload));
    if (
      !proposal.identification?.policyId ||
      !proposal.identification?.proposalId
    ) {
      return { success: false, errors: {} };
    }

    return { success: true, errors: {} };
  }, [checkPolicyholder, dispatch, proposal, validate]);

  return postProposal;
}
