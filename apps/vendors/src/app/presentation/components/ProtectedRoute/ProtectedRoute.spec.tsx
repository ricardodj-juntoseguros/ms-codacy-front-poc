import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, NavigateProps } from 'react-router-dom';
import { UserTypeEnum, VendorsAuthService } from '@services';
import ProtectedRoute from './ProtectedRoute';

process.env.NX_GLOBAL_VENDORS_PLATFORM_URL = '/vendorsUrl';

const renderComponent = (
  componentToRender: React.ComponentType<NavigateProps>,
  allowedRoles: ('insured' | 'broker' | 'policyholder')[],
) => {
  return render(
    <MemoryRouter initialEntries={['/test']}>
      <ProtectedRoute
        path="/test"
        allowedRoles={allowedRoles}
        component={componentToRender}
      />
    </MemoryRouter>,
  );
};

Object.defineProperty(window, 'location', {
  writable: true,
  value: { assign: jest.fn() },
});

describe('Vendors Protected Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should redirect to platform login if user is not authenticated', () => {
    window.location.href = 'pre-approval?';
    jest
      .spyOn(VendorsAuthService, 'isAuthenticated')
      .mockImplementation(() => false);
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.INSURED);
    const componentToRender = () => <h1>Teste 123</h1>;

    renderComponent(componentToRender, ['insured']);
    expect(window.location.assign).toHaveBeenCalledWith(
      '/vendorsUrl/login?redirectUrl=pre-approval?',
    );
  });

  it('Should redirect to default url if user type is not allowed to access route', () => {
    jest
      .spyOn(VendorsAuthService, 'isAuthenticated')
      .mockImplementation(() => true);
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.POLICYHOLDER);
    jest
      .spyOn(VendorsAuthService, 'getRedirectPageAfterLogin')
      .mockImplementation(() => '/vendorsUrl/policies');
    const componentToRender = () => <h1>Teste 123</h1>;

    renderComponent(componentToRender, ['insured']);
    expect(window.location.assign).toHaveBeenCalledWith('/vendorsUrl/policies');
  });

  it('Should render the component route if user is authenticated', () => {
    jest
      .spyOn(VendorsAuthService, 'isAuthenticated')
      .mockImplementation(() => true);
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.INSURED);
    const componentToRender = () => <h1>Teste 123</h1>;
    const component = renderComponent(componentToRender, ['insured']);
    const title = component.findByText('Teste 123');
    expect(title).toBeTruthy();
  });
});
