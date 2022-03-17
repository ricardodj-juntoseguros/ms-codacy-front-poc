import { render } from '@testing-library/react';
import ModalityTabsSkeleton from './ModalityTabsSkeleton';

describe('Modality Tabs Skeleton', () => {
  it('Should render successfully', () => {
    const { container } = render(<ModalityTabsSkeleton />);
    expect(container).toBeTruthy();
  });
});
