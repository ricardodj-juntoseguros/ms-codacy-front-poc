import { render } from '@testing-library/react';
import ModalitySummarySkeleton from './ModalitySummarySkeleton';

describe('Modality Summary Skeleton', () => {
  it('Should render successfully', () => {
    const { container } = render(<ModalitySummarySkeleton />);
    expect(container).toBeTruthy();
  });
});
