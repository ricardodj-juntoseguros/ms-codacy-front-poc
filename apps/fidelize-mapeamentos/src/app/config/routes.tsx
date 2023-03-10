import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import FidelizeMapeamentosImport from '@modules/fidelize-mapeamentos-import';
import Header from '../presentation/components/Header';
import SideMenu from '../presentation/components/SideMenu';
import ProtectedRoute from '../presentation/components/ProtectedRoute';

export default function Routes() {
  return (
    <BrowserRouter>
      <Header />
      <SideMenu />
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={() => <Redirect to="/solicitar" />}
        />
        <ProtectedRoute
          path="/solicitar"
          component={FidelizeMapeamentosImport}
        />
      </Switch>
    </BrowserRouter>
  );
}
