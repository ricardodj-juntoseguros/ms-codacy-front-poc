import { render } from '@testing-library/react';
import ModalityNotAvailable from './ModalityNotAvailable';

describe('ModalityNotAvailable', () => {
  it('Should render successfully', () => {
    const { getByText } = render(<ModalityNotAvailable />);
    expect(getByText('Modalidade indisponível')).toBeTruthy();
    expect(
      getByText(
        'Esta modalidade não está disponível no momento. Em breve você conseguirá acessá-la.',
      ),
    ).toBeTruthy();
  });
});
