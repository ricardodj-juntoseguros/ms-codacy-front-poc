import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { JuntoLogoDark } from './JuntoLogoDark';

describe('Junto Logo Dark', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<JuntoLogoDark />);
    expect(baseElement).toBeInTheDocument();
  });
});
