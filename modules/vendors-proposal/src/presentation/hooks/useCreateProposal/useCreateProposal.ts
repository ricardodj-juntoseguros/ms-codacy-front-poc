import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProposalSchema } from '../../../application/validations/schemas';
import { proposalAdapter } from '../../../application/features/proposal/adapters';
import {
  createProposal,
  proposalActions,
  selectProposal,
  // updateProposal,
} from '../../../application/features/proposal/ProposalSlice';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';
import { ERROR_MESSAGES } from '../../../constants';
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
          error && error.data && error.data.data && error.data.data[0].message
            ? error.data.data[0].message
            : ERROR_MESSAGES.policyholderRegister;
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

    // if (!proposal.identification) {
    await dispatch(createProposal(proposalPayload));
    // } else {
    //   await dispatch(
    //     updateProposal({
    //       policyId: proposal.identification.policyId,
    //       payload: proposalPayload,
    //     }),
    //   );
    // }

    return { success: true, errors: {} };
  }, [checkPolicyholder, dispatch, proposal, validate]);

  return postProposal;
}
