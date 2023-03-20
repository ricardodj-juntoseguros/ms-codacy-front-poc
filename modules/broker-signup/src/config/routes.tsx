import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import  SearchRegistrationContainer  from '../presentation/pages/SearchRegistrationContainer/SearchRegistrationContainer';
import  BrokerDetailsContainer  from '../presentation/pages/BrokerDetailsContainer/BrokerDetailsContainer';
import  RegisterResponsibleContainer  from '../presentation/pages/RegisterResponsibleContainer/RegisterResponsibleContainer';


const Routes: React.FC = () => (
  <BrowserRouter basename="signup">
    <Switch>
      <Route path="/" exact component={SearchRegistrationContainer} />
      <Route path="/register-responsible" exact component={RegisterResponsibleContainer} />
      <Route path="/broker-details" exact component={BrokerDetailsContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
