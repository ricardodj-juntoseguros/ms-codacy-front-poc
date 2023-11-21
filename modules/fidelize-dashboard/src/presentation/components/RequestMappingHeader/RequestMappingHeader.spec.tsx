import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import RequestMappingHeader from './RequestMappingHeader';
import { store } from '../../../config/store';

describe('DashboardHeader', () => {
  it('Should render successfully', () => {
    const component = render(
      <Provider store={store}>
        <RequestMappingHeader />
      </Provider>,
    );
    expect(component.getByText('Nova solicitação de mapeamento')).toBeTruthy();
  });
});
