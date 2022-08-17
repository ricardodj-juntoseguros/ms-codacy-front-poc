import { render } from '@testing-library/react';
import { NotFoundIllustration } from './NotFoundIllustration';
import '@testing-library/jest-dom';

describe('Not Found Illustration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NotFoundIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
