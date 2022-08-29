import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AccessCheckApi from '../application/features/accessCheck/AccessCheckApi';
import DashboardContainer from '../presentation/pages/DashboardContainer';
import NoAccessContainer from '../presentation/pages/NoAccessContainer';
import NoOpportunitiesMappedContainer from '../presentation/pages/NoOpportunitiesMappedContainer';
import LoadingSpinner from '../presentation/components/LoadingSpinner';
import { AccessFeatureEnum } from '../application/types/model/AccessFeatureEnum';

const Routes: React.FC = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    AccessCheckApi.checkAccessToFeature(AccessFeatureEnum.ACCESS_FIDELIZE)
      .then(() => setHasAccess(true))
      .catch(() => setHasAccess(false))
      .finally(() => setIsCheckingAccess(false));
  }, []);

  if (isCheckingAccess) return <LoadingSpinner />;
  const component = hasAccess ? DashboardContainer : NoAccessContainer;
  return (
    <BrowserRouter basename="dashboard">
      <Switch>
        <Route path="/" exact component={component} />
        <Route
          path="/no-opportunities"
          exact
          component={NoOpportunitiesMappedContainer}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
