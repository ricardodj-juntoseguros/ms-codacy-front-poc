import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ImportContainer from '../presentation/pages/ImportContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="importar">
    <Switch>
      <Route path="/" exact component={ImportContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
