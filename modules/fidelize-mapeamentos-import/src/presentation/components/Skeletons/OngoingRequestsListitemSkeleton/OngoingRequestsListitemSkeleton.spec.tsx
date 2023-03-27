import { render } from '@testing-library/react';
import { OngoingRequestsListitemSkeleton } from './OngoingRequestsListitemSkeleton';

describe('Ongoing Requests List Item Skeleton', () => {
  it('Should render successfully', () => {
    const { container } = render(<OngoingRequestsListitemSkeleton />);
    expect(container).toBeTruthy();
  });
});
