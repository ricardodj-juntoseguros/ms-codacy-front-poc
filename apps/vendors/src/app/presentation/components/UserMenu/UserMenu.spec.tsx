import '@testing-library/jest-dom';
import { act, fireEvent, render } from "@testing-library/react"
import { MemoryRouter } from 'react-router-dom';
import UserMenu from "./UserMenu"
import { USER_MENU_ITEMS } from "../../../constants";

describe('UserMenu', () => {
  it('should render with the received information correctly', () => {
    const { baseElement, getAllByText, getByText, getByTestId } = render(
      <MemoryRouter>
        <UserMenu
          isMobile={false}
          username="lorem"
          userEmail="lorem@lorem.com"
          userMenuItems={USER_MENU_ITEMS}
        />
      </MemoryRouter>
    );

    const name = getAllByText('lorem');

    expect(baseElement).toBeInTheDocument();
    expect(name[0]).toBeInTheDocument();


    const userMenuButton = getByTestId('userMenu-button-open-menu');
    fireEvent.click(userMenuButton);
    const userEmail = getByText('lorem@lorem.com');

    expect(userEmail).toBeInTheDocument();
  });

  it('should open the user menu and show the options', async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <UserMenu
          isMobile={false}
          username="lorem"
          userEmail="lorem@lorem.com"
          userMenuItems={USER_MENU_ITEMS}
        />
      </MemoryRouter>
    );

    const userMenuButton = getByTestId('userMenu-button-open-menu');
    await act(async () => {
      fireEvent.click(userMenuButton);
    })


    const preferencesLink = getByText('Preferências');
    const usersLink = getByText('Administrar usuários');

    expect(preferencesLink).toBeInTheDocument();
    expect(usersLink).toBeInTheDocument();
    expect(preferencesLink).toBeInTheDocument();
    expect(usersLink).toBeInTheDocument();
  });

  it('should hide username when on mobile', async () => {
    const { queryAllByText } = render(
      <MemoryRouter>
        <UserMenu
          isMobile
          username="lorem"
          userEmail="lorem@lorem.com"
          userMenuItems={USER_MENU_ITEMS}
        />
      </MemoryRouter>
    );

    const username = await queryAllByText('lorem');

    expect(username.length).toEqual(1);
  });
})
