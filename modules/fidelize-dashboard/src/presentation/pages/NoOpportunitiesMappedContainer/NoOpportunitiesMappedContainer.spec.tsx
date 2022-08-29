import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import NoOpportunitiesMappedContainer from './NoOpportunitiesMappedContainer';

describe('NoOpportunitiesMappedContainer', () => {
  it('Should render without crashing', () => {
    const { container } = render(<NoOpportunitiesMappedContainer />);
    expect(container).toBeInTheDocument();
  });
});
