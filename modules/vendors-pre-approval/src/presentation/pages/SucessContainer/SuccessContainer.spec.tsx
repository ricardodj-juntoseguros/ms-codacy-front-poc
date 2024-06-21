import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import SuccessContainer from './SuccessContainer';

describe('SuccessContainer', () => {
  it('should render success container', () => {
    const { container } = render(<SuccessContainer />, {
      wrapper: BrowserRouter,
    });
    
    expect(container).toBeInTheDocument();
  });
});
