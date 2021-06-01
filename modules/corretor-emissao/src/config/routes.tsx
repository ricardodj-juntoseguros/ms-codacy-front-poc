import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { QuoteContainer } from '../presentation/pages/quoteContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="cotacao">
    <Switch>
      <Route path="/" exact component={QuoteContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
