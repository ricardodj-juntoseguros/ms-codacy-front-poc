import { useCallback } from 'react';
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
import {
  issuanceActions,
  selectIssuance,
} from '../../../application/features/issuance/IssuanceSlice';

export const useIssuance = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentQuote } = useSelector(selectQuote);
  const { comments, isAutomaticPolicy, contacts } = useSelector(selectProposal);
  const { typeOfAuthorization, approvalContacts } = useSelector(
    selectCommercialAuthorization,
  );
  const { loadingIssuance, forceInternalize, internalizeReason } =
    useSelector(selectIssuance);
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
      dispatch(issuanceActions.setLoadingIssuance(true));
      const payload = issuanceAdapter(
        comments,
        contacts,
        isCommercial ? approvalContacts : [],
        isCommercial ? typeOfAuthorization : '',
        forceInternalize,
        internalizeReason || '',
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
        .finally(() => {
          dispatch(issuanceActions.setLoadingIssuance(false));
        });
    },
    [
      dispatch,
      approvalContacts,
      comments,
      currentQuote,
      history,
      typeOfAuthorization,
      onNext,
      contacts,
      forceInternalize,
      internalizeReason,
    ],
  );

  const postIssuance = useCallback(
    (stepName: string) => {
      if (!currentQuote) return;
      dispatch(issuanceActions.setLoadingIssuance(true));
      const payload = issuanceAdapter(
        comments,
        contacts,
        approvalContacts,
        typeOfAuthorization,
        forceInternalize,
        internalizeReason || '',
      );
      IssuanceApi.postIssuance(currentQuote.identification.NewQuoterId, payload)
        .then(response => {
          onNext(stepName, response.issuedAt, response.protocols);
          response.issued
            ? history.push('/success')
            : history.push('/analysis');
        })
        .catch(error => makeToast('error', handleError(error)))
        .finally(() => {
          dispatch(issuanceActions.setLoadingIssuance(false));
        });
    },
    [
      dispatch,
      currentQuote,
      comments,
      approvalContacts,
      typeOfAuthorization,
      onNext,
      history,
      contacts,
      forceInternalize,
      internalizeReason,
    ],
  );

  const createIssuanceOrSubmitToApproval = useCallback(
    async (stepName: string) => {
      const userProfile = BrokerPlatformAuthService.getUserProfile();
      const isCommercial = userProfile === ProfileEnum.COMMERCIAL;
      const isPolicyholder = userProfile === ProfileEnum.POLICYHOLDER;
      if (loadingIssuance) return;
      if (
        (isAutomaticPolicy &&
          isCommercial &&
          !forceInternalize &&
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
    [
      isAutomaticPolicy,
      postIssuance,
      submitToApproval,
      typeOfAuthorization,
      loadingIssuance,
      forceInternalize,
    ],
  );

  return [createIssuanceOrSubmitToApproval] as const;
};
