import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import QuoteContainer from '../presentation/pages/QuoteContainer/QuoteContainer';
import QuoteFinishContainer from '../presentation/pages/QuoteFinishContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="proposal">
    <Switch>
      <Route path="/" exact component={QuoteContainer} />
      <Route path="/finish" exact component={QuoteFinishContainer} />
      <Route path="/:identification" exact component={QuoteContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
