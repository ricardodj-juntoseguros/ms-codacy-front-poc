import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import  SearchRegistrationContainer  from '../presentation/pages/SearchRegistrationContainer/SearchRegistrationContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="signup">
    <Switch>
      <Route path="/" exact component={SearchRegistrationContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
