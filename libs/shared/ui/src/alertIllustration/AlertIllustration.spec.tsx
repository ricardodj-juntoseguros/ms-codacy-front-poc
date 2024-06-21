import { render } from '@testing-library/react';
import { AlertIllustration } from './AlertIllustration';
import '@testing-library/jest-dom';

describe('Alert Illustration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AlertIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
