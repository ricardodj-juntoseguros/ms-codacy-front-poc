import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import FlowContainer from '../presentation/pages/FlowContainer';
import ProposalSummary from '../presentation/pages/ProposalSummaryContainer';
import ProposalSuccess from '../presentation/pages/ProposalSuccessContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="proposal">
    <Switch>
      <Route path="/" exact component={FlowContainer} />
      <Route path="/summary" exact component={ProposalSummary} />
      <Route path="/success" exact component={ProposalSuccess} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
