import { render } from '@testing-library/react';
import { AlertTriangleIllustration } from './AlertTriangleIllustration';
import '@testing-library/jest-dom';

describe('Alert Triangle Illustration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AlertTriangleIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
