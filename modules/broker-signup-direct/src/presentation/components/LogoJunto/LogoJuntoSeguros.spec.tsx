import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import LogoJuntoSeguros from './LogoJuntoSeguros';

describe('LogoJuntoSeguros', () => {
  it('Should render without crashing', () => {
    const { container, getByTestId } = render(<LogoJuntoSeguros />);
    expect(container).toBeInTheDocument();
    expect(getByTestId('Logo-Junto-Seguros')).toBeInTheDocument();
  });
});
