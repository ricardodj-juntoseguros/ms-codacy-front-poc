import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(baseElement).toBeTruthy();
    expect(getByText('Hello Fidelize Mapeamentos!')).toBeInTheDocument();
  });
});
