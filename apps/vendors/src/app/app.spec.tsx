import { act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

describe('App', () => {
  it('should render successfully', async () => {
    await act(async () => {
      global.innerWidth = 1270;
      global.dispatchEvent(new Event('resize'))
    });

    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(baseElement).toBeTruthy();
  });
});
