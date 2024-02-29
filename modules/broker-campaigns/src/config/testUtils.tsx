// test-utils.jsx
import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

import { ThemeProvider, Themes, ToastContainer } from 'junto-design-system';

const AllTheProviders: FC = ({ children }) => {
  return (
    <ThemeProvider theme={Themes.DEFAULT}>
      {children}
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
