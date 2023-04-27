import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Example from '../presentation/pages/Example';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          component={() => <Redirect to="/example" />}
        />
        <Route path="/example" component={Example} />
      </Switch>
    </BrowserRouter>
  );
}
