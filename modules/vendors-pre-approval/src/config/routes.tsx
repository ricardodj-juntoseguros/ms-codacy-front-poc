import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import PreApprovalContainer from '../presentation/pages/PreApprovalContainer';
import SuccessContainer from '../presentation/pages/SucessContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="pre-approval">
    <Switch>
      <Route path="/" exact component={PreApprovalContainer} />
      <Route path="/success" exact component={SuccessContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
