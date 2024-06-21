import { render } from '@testing-library/react';
import { UnderConstructionIllustration } from './UnderConstructionIllustration';
import '@testing-library/jest-dom';

describe('Under Construction', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UnderConstructionIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
