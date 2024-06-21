import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('Should render without crashing', () => {
    const { container, getByTestId } = render(<LoadingSpinner />);
    expect(container).toBeInTheDocument();
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
