import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginContainer from '../presentation/pages/LoginContainer';
import FirstAccessContainer from '../presentation/pages/FirstAccessContainer';
import FirstAccessFinishContainer from '../presentation/pages/FirstAccessFinishContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="login">
    <Switch>
      <Route path="/" exact component={LoginContainer} />
      <Route path="/first-access/:hash&:token" exact component={FirstAccessContainer} />
      <Route path="/first-access-finish" exact component={FirstAccessFinishContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
