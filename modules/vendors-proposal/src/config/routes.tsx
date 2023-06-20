import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import FlowContainer from '../presentation/pages/FlowContainer';
import ProposalSummary from '../presentation/pages/ProposalSummary/ProposalSummary';
import ProposalSuccess from '../presentation/pages/ProposalSuccess/ProposalSuccess';

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
