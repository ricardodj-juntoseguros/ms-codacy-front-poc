import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import CorretorEmissao from '@modules/corretor-emissao';
import ProtectedRoute from '../presentation/components/ProtectedRoute/ProtectedRoute';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={() => <Redirect to="/emissao" />}
        />
        <ProtectedRoute path="/emissao" component={CorretorEmissao} />
      </Switch>
    </BrowserRouter>
  );
}
