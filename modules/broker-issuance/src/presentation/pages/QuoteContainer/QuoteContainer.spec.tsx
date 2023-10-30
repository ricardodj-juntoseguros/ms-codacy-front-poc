import { render } from '../../../config/testUtils';
import { QuoteContainer } from './QuoteContainer';

describe('QuoteContainer component', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QuoteContainer />);

    expect(baseElement).toBeTruthy();
  });
});
