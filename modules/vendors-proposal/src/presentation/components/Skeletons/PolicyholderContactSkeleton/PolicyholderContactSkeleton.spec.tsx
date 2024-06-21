import { render } from '@testing-library/react';
import PolicyholderContactSkeleton from './PolicyholderContactSkeleton';

describe('PolicyholderContactSkeleton', () => {
  it('Should render successfully', () => {
    const { container } = render(<PolicyholderContactSkeleton />);
    expect(container).toBeTruthy();
  });
});
