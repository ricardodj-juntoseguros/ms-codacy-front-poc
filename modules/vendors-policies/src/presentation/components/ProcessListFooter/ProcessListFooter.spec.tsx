import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import ProcessListFooter from './ProcessListFooter';

describe('ProcessListFooter', () => {
  it('Should render proposal correctly', () => {
    const { getByText } = render(<ProcessListFooter />);

    const test = getByText('Desenvolvido por Junto Seguros S.A.');

    expect(test).toBeInTheDocument();
  });
});
