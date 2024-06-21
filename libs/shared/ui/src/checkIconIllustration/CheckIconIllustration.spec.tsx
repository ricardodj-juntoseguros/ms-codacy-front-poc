import { render } from '@testing-library/react';
import { CheckIconIllustration } from './CheckIconIllustration';
import '@testing-library/jest-dom';

describe('Check Icon Illustration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CheckIconIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
