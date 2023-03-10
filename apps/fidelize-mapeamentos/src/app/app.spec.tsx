import '@testing-library/jest-dom';
import { BackofficeAuthService } from '@services';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

Object.defineProperty(window, 'location', {
  writable: true,
  value: { assign: jest.fn() },
});

describe('App', () => {
  it('should render successfully', () => {
    jest
      .spyOn(BackofficeAuthService, 'isAuthenticated')
      .mockImplementationOnce(() => true);
    jest
      .spyOn(BackofficeAuthService, 'getUserIsViewer')
      .mockImplementationOnce(() => false);
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(baseElement).toBeTruthy();
  });
});
