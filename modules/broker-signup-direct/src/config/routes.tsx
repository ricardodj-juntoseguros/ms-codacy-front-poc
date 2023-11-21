import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SearchRegistrationContainer from '../presentation/pages/SearchRegistrationContainer/SearchRegistrationContainer';
import BrokerDetailsContainer from '../presentation/pages/BrokerDetailsContainer/BrokerDetailsContainer';
import RegisterResponsibleContainer from '../presentation/pages/RegisterResponsibleContainer/RegisterResponsibleContainer';
import BrokerUploadDocumentsContainer from '../presentation/pages/BrokerUploadDocumentsContainer/BrokerUploadDocumentsContainer';
import FinishSignupContainer from '../presentation/pages/FinishSignupContainer/FinishSignupContainer';
import ValidationBrokerEmailContainer from '../presentation/pages/ValidationBrokerEmailContainer/ValidationBrokerEmailContainer';
import CreateUserAccessContainer from '../presentation/pages/CreateUserAccessContainer/CreateUserAccessContainer';
import SignupRequestConfirmationContainer from '../presentation/pages/SignupRequestConfirmationContainer/SignupRequestConfirmationContainer';
import BrokerDataReviewContainer from '../presentation/pages/BrokerDataReviewContainer/BrokerDataReviewContainer';
import BrokerInitialUploadDocumentsContainer from '../presentation/pages/BrokerInitialUploadDocumentsContainer/BrokerInitialUploadDocumentsContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="direct">
    <Switch>
      <Route path="/" exact component={SearchRegistrationContainer} />
      <Route
        path="/register-responsible"
        exact
        component={RegisterResponsibleContainer}
      />
      <Route
        path="/validation-email"
        exact
        component={ValidationBrokerEmailContainer}
      />
      <Route path="/broker-details" exact component={BrokerDetailsContainer} />
      <Route
        path="/create-user-access"
        exact
        component={CreateUserAccessContainer}
      />
      <Route
        path="/broker-data-review"
        exact
        component={BrokerDataReviewContainer}
      />
      <Route
        path="/info-upload-documents"
        exact
        component={BrokerInitialUploadDocumentsContainer}
      />
      <Route
        path="/upload-documents"
        exact
        component={BrokerUploadDocumentsContainer}
      />
      <Route path="/finish" exact component={FinishSignupContainer} />
      <Route
        path="/request-confirmation"
        exact
        component={SignupRequestConfirmationContainer}
      />
    </Switch>
  </BrowserRouter>
);

export default Routes;
