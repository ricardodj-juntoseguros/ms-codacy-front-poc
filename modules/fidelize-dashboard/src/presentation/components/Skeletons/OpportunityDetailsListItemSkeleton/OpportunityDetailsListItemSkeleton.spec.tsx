import { render } from '@testing-library/react';
import OpportunityDetailsListItemSkeleton from './OpportunityDetailsListItemSkeleton';

describe('Opportunity Details List Item Skeleton', () => {
  it('Should render successfully', () => {
    const { container } = render(<OpportunityDetailsListItemSkeleton />);
    expect(container).toBeTruthy();
  });
});
