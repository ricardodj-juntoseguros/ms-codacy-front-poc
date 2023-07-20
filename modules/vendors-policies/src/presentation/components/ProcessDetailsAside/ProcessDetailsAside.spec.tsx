import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import ProcessDetailsAside from './ProcessDetailsAside';

describe('ProcessDetailsAside', () => {
  it('Should render correctly', async () => {
    const { getByText } = render(<ProcessDetailsAside name="Name" />);

    expect(getByText('Name')).toBeInTheDocument();
  });
});
