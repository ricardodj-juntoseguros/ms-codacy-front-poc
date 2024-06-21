import { render } from '@testing-library/react';
import InsuredAndPolicyholderSelectionSkeleton from './InsuredAndPolicyholderSelectionSkeleton';

describe('Insured And Policyholder Selection Skeleton', () => {
  it('Should render successfully', () => {
    const { container } = render(<InsuredAndPolicyholderSelectionSkeleton />);
    expect(container).toBeTruthy();
  });
});
