import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import FidelizeDashboard from '@modules/fidelize-dashboard';
import ProtectedRoute from '../presentation/components/ProtectedRoute';
import NotFoundContainer from '../presentation/pages/NotFoundContainer';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={() => <Redirect to="/dashboard" />}
        />
        <ProtectedRoute path="/dashboard" component={FidelizeDashboard} />
        <ProtectedRoute path="/solicitar" component={FidelizeDashboard} />
        <ProtectedRoute
          exact
          path="/pagina-nao-encontrada"
          component={NotFoundContainer}
        />
        <ProtectedRoute
          component={() => <Redirect to="/pagina-nao-encontrada" />}
        />
      </Switch>
    </BrowserRouter>
  );
}
