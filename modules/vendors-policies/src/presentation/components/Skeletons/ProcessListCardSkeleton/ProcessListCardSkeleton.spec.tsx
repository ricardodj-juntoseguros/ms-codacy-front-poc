import '@testing-library/jest-dom';
import { render } from '../../../../config/testUtils';
import ProcessListCardSkeleton from './ProcessListCardSkeleton';

describe('ProcessListCardSkeleton', () => {
  it('Should render sucessfully', () => {
    const { container } = render(<ProcessListCardSkeleton />);
    expect(container).toBeInTheDocument();
  });
});
