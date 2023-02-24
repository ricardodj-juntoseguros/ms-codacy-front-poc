import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import FidelizeMapeamentosImport from '@modules/fidelize-mapeamentos-import';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={() => <Redirect to="/importar" />} />
        <Route path="/importar" component={FidelizeMapeamentosImport} />
      </Switch>
    </BrowserRouter>
  );
}
