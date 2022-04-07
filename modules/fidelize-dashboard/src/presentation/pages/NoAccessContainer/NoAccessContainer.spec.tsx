import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import NoAccessContainer from './NoAccessContainer';

describe('NoAccessContainer', () => {
  it('Should render without crashing', () => {
    const { container } = render(<NoAccessContainer />);
    expect(container).toBeInTheDocument();
  });
});
