import React from 'react';
import { BrowserRouter, Route, Routes as DomRoutes } from 'react-router-dom';
import LoginContainer from '../presentation/pages/LoginContainer';
import FirstAccessContainer from '../presentation/pages/FirstAccessContainer';
import ForgotPasswordContainer from '../presentation/pages/ForgotPasswordContainer';
import FirstAccessFinishContainer from '../presentation/pages/FirstAccessFinishContainer';
import RequestForgotPasswordContainer from '../presentation/pages/RequestForgotPasswordContainer';
import RequestForgotPasswordFinishContainer from '../presentation/pages/RequestForgotPasswordFinishContainer';
import ForgotPasswordFinishContainer from '../presentation/pages/ForgotPasswordFinishContainer';
import RequestResetPasswordInvalid from '../presentation/pages/RequestResetPasswordInvalid';

const Routes: React.FC = () => (
  <DomRoutes>
    <Route path="/" element={<LoginContainer />} />
    <Route path="/first-access/:hash" element={<FirstAccessContainer />} />
    <Route
      path="/forgot-password/:hash&:token"
      element={<ForgotPasswordContainer />}
    />
    <Route
      path="/forgot-password-finish"
      element={<ForgotPasswordFinishContainer />}
    />
    <Route
      path="/first-access-finish/:proposalId?/:guid?"
      element={<FirstAccessFinishContainer />}
    />
    <Route
      path="/request-forgot-password"
      element={<RequestForgotPasswordContainer />}
    />
    <Route
      path="/request-forgot-password-finish"
      element={<RequestForgotPasswordFinishContainer />}
    />
    <Route
      path="/request-reset-password-invalid"
      element={<RequestResetPasswordInvalid />}
    />
  </DomRoutes>
);

export default Routes;
