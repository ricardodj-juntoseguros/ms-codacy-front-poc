import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AccessCheckApi from '../application/features/accessCheck/AccessCheckApi';
import DashboardContainer from '../presentation/pages/DashboardContainer';
import NoAccessContainer from '../presentation/pages/NoAccessContainer';
import NoOpportunitiesMappedContainer from '../presentation/pages/NoOpportunitiesMappedContainer';
import LoadingSpinner from '../presentation/components/LoadingSpinner';
import { AccessFeatureEnum } from '../application/types/model/AccessFeatureEnum';
import {
  selectMappedPolicyholders,
  fetchMappedPolicyholders,
} from '../application/features/policyholderFilter/PolicyholderFilterSlice';
import { summaryActions } from '../application/features/summary/SummarySlice';

const Routes: React.FC = () => {
  const dispatch = useDispatch();
  const mappedPolicyholders = useSelector(selectMappedPolicyholders);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AccessCheckApi.checkAccessToFeature(AccessFeatureEnum.ACCESS_FIDELIZE)
      .then(() => {
        setHasAccess(true);
        dispatch(fetchMappedPolicyholders());
      })
      .catch(() => {
        setHasAccess(false);
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    if (mappedPolicyholders) {
      dispatch(
        summaryActions.setTotalPolicyholders(mappedPolicyholders.length),
      );
      setLoading(false);
    }
  }, [mappedPolicyholders, dispatch]);

  const getComponentToRender = () => {
    if (!hasAccess) {
      return NoAccessContainer;
    }
    if (mappedPolicyholders?.length === 0) {
      return NoOpportunitiesMappedContainer;
    }
    return DashboardContainer;
  };

  if (loading) return <LoadingSpinner />;
  return (
    <BrowserRouter basename="dashboard">
      <Switch>
        <Route path="/" exact component={getComponentToRender()} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
