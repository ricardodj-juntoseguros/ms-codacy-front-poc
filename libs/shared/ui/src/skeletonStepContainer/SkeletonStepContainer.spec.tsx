import { render } from '@testing-library/react';
import { SkeletonStepContainer } from './SkeletonStepContainer';
import '@testing-library/jest-dom';

describe('SkeletonStepContainer', () => {
  it('should render successfully', () => {
    const { container } = render(<SkeletonStepContainer />);

    expect(container).toBeInTheDocument();
  });
});
