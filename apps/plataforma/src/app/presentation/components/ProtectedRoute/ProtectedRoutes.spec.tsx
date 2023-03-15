import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, RouteComponentProps } from 'react-router-dom';
import { BrokerPlatformAuthService } from '@services';
import ProtectedRoute from './ProtectedRoute';

process.env.NX_GLOBAL_BROKER_PLATFORM_URL = '/test_broker_login';

const renderComponent = (
  componentToRender: React.ComponentType<RouteComponentProps>,
) => {
  return render(
    <MemoryRouter initialEntries={['/test']}>
      <ProtectedRoute path="/test" component={componentToRender} />
    </MemoryRouter>,
  );
};

describe('ProtectedRoute', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn(), href: 'corretor/emissão' },

    });
  });
  /*
  it('Should redirect to broker platform if user is not authenticated', () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'isAuthenticated')
      .mockImplementation(() => false);
    const componentToRender = () => <h1>Teste 123</h1>;

    renderComponent(componentToRender);

    expect(window.location.assign).toHaveBeenCalledWith(
      '/test_broker_login?redirectUrl=corretor/emissão',
    );
  });
*/
  it('Should render the component if user is authenticated and is broker', () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'isAuthenticated')
      .mockImplementation(() => true);
    const componentToRender = () => <h1>Teste 123</h1>;

    const component = renderComponent(componentToRender);
    const title = component.findByText('Teste 123');
    expect(title).toBeTruthy();
  });
});
