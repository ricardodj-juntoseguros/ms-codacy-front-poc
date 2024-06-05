import Router from 'react-router';
import { render } from '../../../config/testUtils';
import QuoteContainer from './QuoteContainer';

describe('QuoteContainer', () => {
  it('should render successfully', () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ identification: undefined });
    const { baseElement } = render(<QuoteContainer />);
    expect(baseElement).toBeTruthy();
  });
});
