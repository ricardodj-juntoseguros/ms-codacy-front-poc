import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('Should render without crashing', () => {
    const { container } = render(<Spinner width={100} height={100} />);
    expect(container).toBeInTheDocument();
  });
});
