/* eslint-disable consistent-return */
import Cookies from 'js-cookie';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrokerPlatformAuthService } from '@services';
import { selectModality } from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import { policyholderSelectionActions } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { REDIRECT_TO_V3_INFOS } from '../../../constants';

export const useRehydrateData = () => {
  const dispatch = useDispatch();
  const { modalityOptions } = useSelector(selectModality);
  const { setPolicyholderSearchValue } = policyholderSelectionActions;
  const { setModality } = quoteSliceActions;
  const cookie = Cookies.get(REDIRECT_TO_V3_INFOS);
  const v3settings = cookie && JSON.parse(cookie);

  useEffect(() => {
    if (!modalityOptions || !v3settings) return;
    const { modalityId } = v3settings;
    const modality = modalityOptions.find(
      modality => modality.id === modalityId,
    );
    if (modality) {
      dispatch(setModality(modality));
      Cookies.remove(REDIRECT_TO_V3_INFOS, {
        domain: `${process.env.NX_GLOBAL_COOKIE_DOMAIN}`,
      });
    }
  }, [dispatch, modalityOptions, setModality, v3settings]);

  const rehydrateData = useCallback(async () => {
    if (!v3settings) return;
    const { policyholderFederalId } = v3settings;
    dispatch(
      setPolicyholderSearchValue({
        value: policyholderFederalId,
        profile: BrokerPlatformAuthService.getUserProfile(),
      }),
    );
  }, [dispatch, setPolicyholderSearchValue, v3settings]);

  return rehydrateData;
};
