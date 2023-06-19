import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, RouteComponentProps } from 'react-router-dom';
import { VendorsAuthService } from '@services';
import ProtectedRoute from './ProtectedRoute';

process.env.NX_GLOBAL_VENDORS_PLATFORM_URL = '/vendorsUrl';

const renderComponent = (
  componentToRender: React.ComponentType<RouteComponentProps>,
) => {
  return render(
    <MemoryRouter initialEntries={['/test']}>
      <ProtectedRoute path="/test" component={componentToRender} />
    </MemoryRouter>,
  );
};

Object.defineProperty(window, 'location', {
  writable: true,
  value: { assign: jest.fn() },
});

describe('Vendors Protected Route', () => {
  it('Should redirect to backoffice platform login if user is not authenticated', () => {
    jest
      .spyOn(VendorsAuthService, 'isAuthenticated')
      .mockImplementation(() => false);
    const componentToRender = () => <h1>Teste 123</h1>;

    renderComponent(componentToRender);
    expect(window.location.assign).toHaveBeenCalledWith('/vendorsUrl/login');
  });

  it('Should render the component route if user is authenticated', () => {
    jest
      .spyOn(VendorsAuthService, 'isAuthenticated')
      .mockImplementation(() => true);
    const componentToRender = () => <h1>Teste 123</h1>;
    const component = renderComponent(componentToRender);
    const title = component.findByText('Teste 123');
    expect(title).toBeTruthy();
  });
});
