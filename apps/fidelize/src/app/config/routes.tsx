import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from '../presentation/components/ProtectedRoute';
import NotFoundContainer from '../presentation/pages/NotFoundContainer';

const Hello = () => <h1>Hello Dashboard</h1>;

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={() => <Redirect to="/dashboard" />}
        />
        <ProtectedRoute exact path="/dashboard" component={Hello} />
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
