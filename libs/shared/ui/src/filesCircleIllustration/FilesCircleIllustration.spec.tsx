import { render } from '@testing-library/react';
import { FilesCircleIllustration } from './FilesCircleIllustration';
import '@testing-library/jest-dom';

describe('Files Circle Illustration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FilesCircleIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
