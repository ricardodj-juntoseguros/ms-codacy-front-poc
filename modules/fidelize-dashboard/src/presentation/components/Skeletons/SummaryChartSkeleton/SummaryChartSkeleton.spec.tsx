import { render } from '@testing-library/react';
import SummaryChartSkeleton from './SummaryChartSkeleton';

describe('Opportunity Details List Item Skeleton', () => {
  it('Should render successfully', () => {
    const { container } = render(<SummaryChartSkeleton />);
    expect(container).toBeTruthy();
  });
});
