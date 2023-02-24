import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import ImportContainer from './ImportContainer';

describe('ImportContainer', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(<ImportContainer />);

    expect(baseElement).toBeTruthy();
    expect(getByText('Hello ImportContainer!')).toBeInTheDocument();
  });
});
