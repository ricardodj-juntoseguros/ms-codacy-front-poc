import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import QuoteContainer from '../presentation/pages/QuoteContainer/QuoteContainer';
import AppointmentLetterSentContainer from '../presentation/pages/AppointmentLetterSentContainer';
import ProposalFinishContainer from '../presentation/pages/ProposalFinishContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="proposal">
    <Switch>
      <Route path="/" exact component={QuoteContainer} />
      <Route
        path="/appointment-sent"
        exact
        component={AppointmentLetterSentContainer}
      />
      <Route
        path="/success"
        exact
        render={props => (
          <ProposalFinishContainer feedbackType="success" {...props} />
        )}
      />
      <Route
        path="/analysis"
        exact
        render={props => (
          <ProposalFinishContainer feedbackType="analysis" {...props} />
        )}
      />
      <Route path="/:identification" exact component={QuoteContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
