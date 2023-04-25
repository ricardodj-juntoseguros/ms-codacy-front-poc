import { render } from '@testing-library/react';
import { DoneRequestsListitemSkeleton } from './DoneRequestsListitemSkeleton';

describe('Done Requests List Item Skeleton', () => {
  it('Should render successfully', () => {
    const { container } = render(<DoneRequestsListitemSkeleton />);
    expect(container).toBeTruthy();
  });
});
