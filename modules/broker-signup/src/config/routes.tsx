import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import  SearchRegistrationContainer  from '../presentation/pages/SearchRegistrationContainer/SearchRegistrationContainer';
import  RegisterResponsibleContainer  from '../presentation/pages/RegisterResponsibleContainer/RegisterResponsibleContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="signup">
    <Switch>
      <Route path="/" exact component={SearchRegistrationContainer} />
      <Route path="/register-responsible" exact component={RegisterResponsibleContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
