import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { FlowContainer } from '../presentation/pages';

const Routes: React.FC = () => (
  <BrowserRouter basename="emissao">
    <Switch>
      <Route path="/" exact component={FlowContainer} />
      <Route path="/teste" exact component={FlowContainer} />
      <Route path="/teste/:id" component={FlowContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
