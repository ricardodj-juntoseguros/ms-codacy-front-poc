import { BrowserRouter, Switch } from 'react-router-dom';
import FidelizeMapeamentosImport from '@modules/fidelize-mapeamentos-import';
import Header from '../presentation/components/Header';
import SideMenu from '../presentation/components/SideMenu';
import ProtectedRoute from '../presentation/components/ProtectedRoute';
import ComponentsWrapper from '../presentation/components/ComponentsWrapper/ComponentsWrapper';

export default function Routes() {
  return (
    <BrowserRouter>
      <Header />
      <ComponentsWrapper>
        <SideMenu />
        <Switch>
          <ProtectedRoute path="/" component={FidelizeMapeamentosImport} />
        </Switch>
      </ComponentsWrapper>
    </BrowserRouter>
  );
}
