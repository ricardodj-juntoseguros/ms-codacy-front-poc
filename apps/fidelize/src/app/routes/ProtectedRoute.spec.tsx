import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import AuthService from '../services/AuthService';
import ProtectedRoute from './ProtectedRoute';

process.env.NX_GLOBAL_BROKER_PLATFORM_URL = '/test_broker_login';
process.env.NX_GLOBAL_BROKER_PROCESSES_URL = '/test_broker_processes';
process.env.NX_FID_APP_URL = 'fidelize_url';

const renderComponent = (componentToRender: React.ComponentType) => {
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
      value: { assign: jest.fn() },
    });
  });

  it('Should redirect to broker platform if user is not authenticated', () => {
    jest.spyOn(AuthService, 'isAuthenticated').mockImplementation(() => false);
    jest.spyOn(AuthService, 'isBroker').mockImplementation(() => false);
    const componentToRender = () => <h1>Teste 123</h1>;

    renderComponent(componentToRender);

    expect(window.location.assign).toHaveBeenCalledWith(
      '/test_broker_login?redirectUrl=fidelize_url',
    );
  });

  it('Should redirect to broker processes if user is authenticated but is not a broker', () => {
    jest.spyOn(AuthService, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(AuthService, 'isBroker').mockImplementation(() => false);
    const componentToRender = () => <h1>Teste 123</h1>;

    renderComponent(componentToRender);

    expect(window.location.assign).toHaveBeenCalledWith(
      '/test_broker_processes',
    );
  });

  it('Should render the component if user is authenticated and is broker', () => {
    jest.spyOn(AuthService, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(AuthService, 'isBroker').mockImplementation(() => true);
    const componentToRender = () => <h1>Teste 123</h1>;

    const component = renderComponent(componentToRender);
    const title = component.findByText('Teste 123');
    expect(title).toBeTruthy();
  });
});
