import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { QuoteContainer } from '../presentation/pages/QuoteContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="emissao">
    <Switch>
      <Route path="/" exact component={QuoteContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
