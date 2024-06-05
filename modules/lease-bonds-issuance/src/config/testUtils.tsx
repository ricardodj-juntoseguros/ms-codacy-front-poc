// test-utils.jsx
import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';

import { ThemeProvider, Themes, ToastContainer } from 'junto-design-system';
import { store } from './store';

const AllTheProviders: FC = ({ children }) => {
  return (
    <ThemeProvider theme={Themes.DEFAULT}>
      <Provider store={store}>{children}</Provider>
      <ToastContainer />
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
