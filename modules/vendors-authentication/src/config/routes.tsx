import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginContainer from '../presentation/pages/LoginContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="login">
    <Switch>
      <Route path="/" exact component={LoginContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
