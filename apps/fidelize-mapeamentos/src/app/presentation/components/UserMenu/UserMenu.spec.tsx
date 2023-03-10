import { BackofficeAuthService } from '@services';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import UserMenu from './UserMenu';

process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL = 'backofficeurl';
describe('UserMenu', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
    jest
      .spyOn(BackofficeAuthService, 'getUserName')
      .mockImplementation(() => 'test_user');
  });

  it('Should render without crashing', () => {
    const { baseElement } = render(<UserMenu />);
    expect(baseElement).toBeInTheDocument();
  });

  it('Should render username greet', () => {
    const { getByText } = render(<UserMenu />);
    expect(getByText('Olá, test_user')).toBeInTheDocument();
  });

  it('Should open menu and logout on click', () => {
    jest.spyOn(BackofficeAuthService, 'clearAuthData');
    const { getByTestId } = render(<UserMenu />);
    fireEvent.click(getByTestId('user-menu'));
    fireEvent.click(getByTestId('logout-btn'));
    expect(BackofficeAuthService.clearAuthData).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith('backofficeurl/logout');
  });
});
