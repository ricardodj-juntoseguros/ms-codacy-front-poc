import { BrokerPlatformAuthService } from '@services';
import { fireEvent, render } from '@testing-library/react';
import UserMenu from './UserMenu';

describe('User Menu', () => {
  beforeAll(() => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUsername')
      .mockImplementation(() => 'test_user');
    jest.spyOn(BrokerPlatformAuthService, 'logout').mockImplementation();
  });

  it('Should render Avatar accordingly', async () => {
    const { findAllByTestId } = render(<UserMenu />);
    expect((await findAllByTestId('user-menu-avatar')).length).toBe(2);
    expect((await findAllByTestId('user-menu-avatar'))[0].textContent).toBe(
      'T',
    );
  });

  it('Should open menu dropdown nav when avatar is clicked', async () => {
    const { getByTestId } = render(<UserMenu />);
    const trigger = getByTestId('user-menu-trigger');
    fireEvent.click(trigger);
    expect(getByTestId('user-menu-nav').className).toBe(
      'user-menu__nav user-menu__nav--open',
    );
  });

  it('Should call logout service if logout button is clicked', () => {
    const { getByTestId } = render(<UserMenu />);
    const logoutBtn = getByTestId('user-menu-logout-button');
    fireEvent.click(logoutBtn);
    expect(BrokerPlatformAuthService.logout).toHaveBeenCalledTimes(1);
  });
});
