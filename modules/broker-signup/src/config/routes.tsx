import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import  CorretorCadastro  from '../presentation/pages/corretorCadastro/CorretorCadastro';

const Routes: React.FC = () => (
  <BrowserRouter basename="signup">
    <Switch>
      <Route path="/" exact component={CorretorCadastro} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
