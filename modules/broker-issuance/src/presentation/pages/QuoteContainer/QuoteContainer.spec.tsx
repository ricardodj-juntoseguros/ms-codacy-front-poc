import { render } from '../../../config/testUtils';
import QuoteContainer from './QuoteContainer';

describe('QuoteContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QuoteContainer />);
    expect(baseElement).toBeTruthy();
  });
});
