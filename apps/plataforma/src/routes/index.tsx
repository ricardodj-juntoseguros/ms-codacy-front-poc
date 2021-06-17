import { Route, BrowserRouter } from 'react-router-dom';
import CorretorEmissao from '../../../../modules/corretor-emissao/src';

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/cotacao" component={CorretorEmissao} />
    </BrowserRouter>
  );
}
