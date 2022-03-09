import { render, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  beforeAll(() => {
    process.env.NX_GLOBAL_BROKER_PROCESSES_URL = '/processes';
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  it('Should go back to broker processes page on back button click', () => {
    const { getByTestId } = render(<Header />);
    const btn = getByTestId('header-back-btn');
    fireEvent.click(btn);
    expect(window.location.assign).toHaveBeenCalledWith('/processes');
  });
});
