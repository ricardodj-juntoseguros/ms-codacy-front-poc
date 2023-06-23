import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import ProcessListContainer from './ProcessListContainer';

describe('ProcessListContainer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', async () => {
    const { getByText } = render(<ProcessListContainer />);

    expect(getByText('Hello Vendors Policies')).toBeInTheDocument();
  });
});
