import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ImportContainer from '../presentation/pages/ImportContainer';
import MappingsPanelContainer from '../presentation/pages/MappingsPanelContainer/MappingsPanelContainer';

const Routes: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={MappingsPanelContainer} />
      <Route path="/solicitar" exact component={ImportContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
