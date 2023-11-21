import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { BrokerPlatformAuthService } from '@services';
import LastAccessValidationApi from '../application/features/lastAccessValidation/LastAccessValidationApi';
import {
  selectMappedPolicyholders,
  fetchMappedPolicyholders,
} from '../application/features/policyholderFilter/PolicyholderFilterSlice';

import { summaryActions } from '../application/features/summary/SummarySlice';
import DashboardContainer from '../presentation/pages/DashboardContainer';
import NoAccessContainer from '../presentation/pages/NoAccessContainer';
import NoOpportunitiesMappedContainer from '../presentation/pages/NoOpportunitiesMappedContainer';
import LoadingSpinner from '../presentation/components/LoadingSpinner';
import RequestMappingContainer from '../presentation/pages/RequestMappingContainer';
import { fetchAllMappedPolicyholdersInWallet } from '../application/features/viewAllPolicyholdersInWallet/ViewAllPolicyholdersInWalletSlice';

const Routes: React.FC = () => {
  const dispatch = useDispatch();
  const mappedPolicyholders = useSelector(selectMappedPolicyholders);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fidelizeBrokersFeaturesCookie = Cookies.get(
      process.env.NX_GLOBAL_FIDELIZE_BROKER_FEATURES_COOKIE || 'fbfc',
    );
    if (!fidelizeBrokersFeaturesCookie) {
      setHasAccess(false);
    } else {
      const { features } = JSON.parse(fidelizeBrokersFeaturesCookie);
      setHasAccess(features.includes('ACCESS_FIDELIZE'));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (hasAccess) {
      history.location?.pathname === '/dashboard'
        ? dispatch(fetchMappedPolicyholders())
        : dispatch(fetchAllMappedPolicyholdersInWallet());
      const lastAccessCookie =
        BrokerPlatformAuthService.getFidelizeBrokerLastAccessCookie();
      if (!lastAccessCookie) {
        LastAccessValidationApi.getBrokerLastAccessDate().then(
          ({ lastAccess }) => {
            BrokerPlatformAuthService.setFidelizeBrokerLastAccessCookie(
              lastAccess,
            );
            LastAccessValidationApi.saveBrokerLastAccess();
          },
        );
      } else {
        LastAccessValidationApi.saveBrokerLastAccess();
      }
    }
  }, [hasAccess, dispatch]);

  useEffect(() => {
    if (mappedPolicyholders) {
      dispatch(
        summaryActions.setTotalPolicyholders(mappedPolicyholders.length),
      );
      setLoading(false);
    }
  }, [mappedPolicyholders, dispatch]);

  const getComponentToRender = () => {
    if (!hasAccess) return NoAccessContainer;
    if (mappedPolicyholders?.length === 0)
      return NoOpportunitiesMappedContainer;
    return history.location?.pathname === '/dashboard'
      ? DashboardContainer
      : RequestMappingContainer;
  };

  if (loading) return <LoadingSpinner />;
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/dashboard" exact component={getComponentToRender()} />
        <Route path="/solicitar" exact component={getComponentToRender()} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
