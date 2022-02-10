import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const Hello = () => <h1>Hello Dashboard</h1>;

export default function Routes() {
  return (
    <BrowserRouter>
      <ProtectedRoute
        exact
        path="/"
        component={() => <Redirect to="/dashboard" />}
      />
      <ProtectedRoute path="/dashboard" component={Hello} />
    </BrowserRouter>
  );
}
