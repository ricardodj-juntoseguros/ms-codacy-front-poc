import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import Header from './Header';

process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL = 'backofficeurl';
describe('Header', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  it('Should render without crashing', () => {
    const { baseElement } = render(<Header />);
    expect(baseElement).toBeInTheDocument();
  });

  it('Should redirect to backoffice on logo click', () => {
    const { getByTestId } = render(<Header />);
    fireEvent.click(getByTestId('logo'));
    expect(window.location.assign).toHaveBeenCalledWith('backofficeurl');
  });
});
