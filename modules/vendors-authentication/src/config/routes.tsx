import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginContainer from '../presentation/pages/LoginContainer';
import FirstAccessContainer from '../presentation/pages/FirstAccessContainer';
import ForgotPasswordContainer from '../presentation/pages/ForgotPasswordContainer';
import FirstAccessFinishContainer from '../presentation/pages/FirstAccessFinishContainer';
import RequestForgotPasswordContainer from '../presentation/pages/RequestForgotPasswordContainer';
import RequestForgotPasswordFinishContainer from '../presentation/pages/RequestForgotPasswordFinishContainer';
import ForgotPasswordFinishContainer from '../presentation/pages/ForgotPasswordFinishContainer';
import RequestResetPasswordInvalid from '../presentation/pages/RequestResetPasswordInvalid';


const Routes: React.FC = () => (
  <BrowserRouter basename="login">
    <Switch>
      <Route path="/" exact component={LoginContainer} />
      <Route path="/first-access/:hash&:token" exact component={FirstAccessContainer} />
      <Route path="/forgot-password/:hash&:token" exact component={ForgotPasswordContainer} />
      <Route path="/forgot-password-finish" exact component={ForgotPasswordFinishContainer} />
      <Route path="/first-access-finish" exact component={FirstAccessFinishContainer} />
      <Route path="/request-forgot-password" exact component={RequestForgotPasswordContainer} />
      <Route path="/request-forgot-password-finish" exact component={RequestForgotPasswordFinishContainer} />
      <Route path="/request-reset-password-invalid" exact component={RequestResetPasswordInvalid} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
