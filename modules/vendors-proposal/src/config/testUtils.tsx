// test-utils.jsx
import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'junto-design-system';

import { store } from './store';
import { FileProvider } from './filesContext';

const AllTheProviders: FC = ({ children }) => {
  return (
    <Provider store={store}>
      <FileProvider>{children}</FileProvider>
      <ToastContainer />
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
