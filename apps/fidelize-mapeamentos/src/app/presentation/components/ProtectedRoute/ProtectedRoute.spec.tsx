import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, RouteComponentProps } from 'react-router-dom';
import { BackofficeAuthService } from '@services';
import ProtectedRoute from './ProtectedRoute';

process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL = '/backofficeurl';

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

describe('Fidelize Mapeamentos Protected Route', () => {
  it('Should redirect to backoffice platform login if user is not authenticated', () => {
    jest
      .spyOn(BackofficeAuthService, 'isAuthenticated')
      .mockImplementation(() => false);
    jest
      .spyOn(BackofficeAuthService, 'getUserHasOpportunityRequest')
      .mockImplementation(() => true);
    const componentToRender = () => <h1>Teste 123</h1>;

    renderComponent(componentToRender);

    expect(window.location.assign).toHaveBeenCalledWith('/backofficeurl');
  });

  it('Should redirect to backoffice processes if user is authenticated but hasOpportunityRequest flag is false', () => {
    jest
      .spyOn(BackofficeAuthService, 'isAuthenticated')
      .mockImplementation(() => true);
    jest
      .spyOn(BackofficeAuthService, 'getUserHasOpportunityRequest')
      .mockImplementation(() => false);
    const componentToRender = () => <h1>Teste 123</h1>;

    renderComponent(componentToRender);

    expect(window.location.assign).toHaveBeenCalledWith('/backofficeurl/home');
  });

  it('Should render the component if user is authenticated and is broker', () => {
    jest
      .spyOn(BackofficeAuthService, 'isAuthenticated')
      .mockImplementation(() => true);
    jest
      .spyOn(BackofficeAuthService, 'getUserHasOpportunityRequest')
      .mockImplementation(() => true);
    const componentToRender = () => <h1>Teste 123</h1>;

    const component = renderComponent(componentToRender);
    const title = component.findByText('Teste 123');
    expect(title).toBeTruthy();
  });
});
