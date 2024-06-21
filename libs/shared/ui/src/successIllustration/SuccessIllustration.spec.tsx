import { render } from '@testing-library/react';
import { SuccessIllustration } from './SuccessIllustration';
import '@testing-library/jest-dom';

describe('Success Illustration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SuccessIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
