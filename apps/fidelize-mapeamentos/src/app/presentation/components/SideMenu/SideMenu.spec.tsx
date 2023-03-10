import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SideMenu from './SideMenu';

Object.defineProperty(window, 'location', {
  writable: true,
  value: { assign: jest.fn() },
});

process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL = 'backofficeurl';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('SideMenu', () => {
  it('Should render without crashing', () => {
    const { getByTestId } = render(<SideMenu />);
    expect(getByTestId('menuitem-home')).toBeInTheDocument();
    expect(getByTestId('menuitem-mapeamentos-fidelize')).toBeInTheDocument();
  });

  it('Should redirect to backoffice platform if clicked item is home', () => {
    const { getByTestId } = render(<SideMenu />);
    fireEvent.click(getByTestId('menuitem-home'));
    expect(window.location.assign).toHaveBeenCalledWith('backofficeurl/home');
  });

  it('Should go to root route if clicked item is fidelize-mapeamentos', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <SideMenu />
      </MemoryRouter>,
    );
    fireEvent.click(getByTestId('menuitem-mapeamentos-fidelize'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });
});
