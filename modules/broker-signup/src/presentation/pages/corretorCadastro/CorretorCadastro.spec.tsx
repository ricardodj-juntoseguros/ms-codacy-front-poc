import { render } from '../../../config/testUtils';
import  CorretorCadastro  from './CorretorCadastro';

describe('QuoteContainer component', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CorretorCadastro />);

    expect(baseElement).toBeTruthy();
  });
});
