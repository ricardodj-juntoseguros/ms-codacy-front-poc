import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import QuotationPricingSkeleton from './QuotationPricingSkeleton';

describe('QuotationPricingSkeleton', () => {
  it('should render successfully', () => {
    const { container } = render(<QuotationPricingSkeleton />);

    expect(container).toBeInTheDocument();
  });
});
