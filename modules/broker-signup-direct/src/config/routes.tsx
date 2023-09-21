import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import  SearchRegistrationContainer  from '../presentation/pages/SearchRegistrationContainer/SearchRegistrationContainer';
import  BrokerDetailsContainer  from '../presentation/pages/BrokerDetailsContainer/BrokerDetailsContainer';
import  RegisterResponsibleContainer  from '../presentation/pages/RegisterResponsibleContainer/RegisterResponsibleContainer';
import  BrokerUploadDocumentsContainer  from '../presentation/pages/BrokerUploadDocumentsContainer/BrokerUploadDocumentsContainer';
import  FinishSignupContainer  from '../presentation/pages/FinishSignupContainer/FinishSignupContainer';


const Routes: React.FC = () => (
  <BrowserRouter basename="direct">
    <Switch>
      <Route path="/" exact component={SearchRegistrationContainer} />
      <Route path="/register-responsible" exact component={RegisterResponsibleContainer} />
      <Route path="/broker-details" exact component={BrokerDetailsContainer} />
      <Route path="/upload-documents" exact component={BrokerUploadDocumentsContainer} />
      <Route path="/finish-signup" exact component={FinishSignupContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
