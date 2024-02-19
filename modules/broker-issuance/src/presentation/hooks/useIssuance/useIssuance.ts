import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { makeToast } from 'junto-design-system';
import { useFlow } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { issuanceAdapter } from '../../../application/features/issuance/adapters';
import { SubmitToApprovalOrIssuanceResultDTO } from '../../../application/types/dto';
import IssuanceApi from '../../../application/features/issuance/IssuanceApi';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import handleError from '../../../helpers/handlerError';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { POLICYHOLDER_ISSUE_PERMISSION } from '../../../constants';
import { selectCommercialAuthorization } from '../../../application/features/CommercialAuthorization/CommercialAuthorizationSlice';

export const useIssuance = () => {
  const [loadingIssuance, setLoadingIssuance] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentQuote } = useSelector(selectQuote);
  const { comments, isAutomaticPolicy } = useSelector(selectProposal);
  const { typeOfAuthorization, approvalContacts } = useSelector(
    selectCommercialAuthorization,
  );
  const { advanceStep } = useFlow();
  const { setIssuedAt, setProtocols } = proposalActions;

  const onNext = useCallback(
    (
      stepName: string,
      issuedAt: string | null,
      protocols: SubmitToApprovalOrIssuanceResultDTO['protocols'],
    ) => {
      advanceStep(stepName);
      dispatch(setIssuedAt(issuedAt));
      dispatch(setProtocols(protocols));
    },
    [advanceStep, dispatch, setIssuedAt, setProtocols],
  );

  const submitToApproval = useCallback(
    (stepName: string, isCommercial: boolean) => {
      if (!currentQuote) return;
      setLoadingIssuance(true);
      const payload = issuanceAdapter(
        comments,
        [],
        isCommercial ? approvalContacts : [],
        isCommercial ? typeOfAuthorization : '',
      );
      ProposalApi.submitToApproval(
        currentQuote.identification.NewQuoterId,
        payload,
      )
        .then(response => {
          onNext(stepName, response.issuedAt, response.protocols);
          history.push('/send-to-approval');
        })
        .catch(error => makeToast('error', handleError(error)))
        .finally(() => setLoadingIssuance(false));
    },
    [
      approvalContacts,
      comments,
      currentQuote,
      history,
      onNext,
      typeOfAuthorization,
    ],
  );

  const postIssuance = useCallback(
    (stepName: string) => {
      if (!currentQuote) return;
      setLoadingIssuance(true);
      const payload = issuanceAdapter(
        comments,
        [],
        approvalContacts,
        typeOfAuthorization,
      );
      IssuanceApi.postIssuance(currentQuote.identification.NewQuoterId, payload)
        .then(response => {
          onNext(stepName, response.issuedAt, response.protocols);
          response.issued
            ? history.push('/success')
            : history.push('/analysis');
        })
        .catch(error => makeToast('error', handleError(error)))
        .finally(() => setLoadingIssuance(false));
    },
    [
      currentQuote,
      comments,
      approvalContacts,
      typeOfAuthorization,
      onNext,
      history,
    ],
  );

  const createIssuanceOrSubmitToApproval = useCallback(
    async (stepName: string) => {
      const userProfile = BrokerPlatformAuthService.getUserProfile();
      const isCommercial = userProfile === ProfileEnum.COMMERCIAL;
      const isPolicyholder = userProfile === ProfileEnum.POLICYHOLDER;
      if (
        (isAutomaticPolicy &&
          isCommercial &&
          typeOfAuthorization === 'sendToApproval') ||
        (isPolicyholder &&
          !BrokerPlatformAuthService.userHasPermission(
            POLICYHOLDER_ISSUE_PERMISSION,
          ))
      ) {
        submitToApproval(stepName, isCommercial);
        return;
      }
      postIssuance(stepName);
    },
    [isAutomaticPolicy, postIssuance, submitToApproval, typeOfAuthorization],
  );

  return [createIssuanceOrSubmitToApproval, loadingIssuance] as const;
};
