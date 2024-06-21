import { render } from '@testing-library/react';
import { CogsAndChartsIllustration } from './CogsAndChartsIllustration';
import '@testing-library/jest-dom';

describe('Cogs And Charts Illustration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CogsAndChartsIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
