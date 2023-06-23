import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ProcessListContainer from '../presentation/pages/ProcessListContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="policies">
    <Switch>
      <Route path="/" exact component={ProcessListContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
