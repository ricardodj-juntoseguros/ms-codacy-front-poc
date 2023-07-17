import { render } from '@testing-library/react';
import { LoadingSkeleton } from './LoadingSkeleton';
import '@testing-library/jest-dom';

describe('LoadingSkeleton', () => {
  it('should render successfully', () => {
    const { container } = render(<LoadingSkeleton />);

    expect(container).toBeInTheDocument();
  });
});
