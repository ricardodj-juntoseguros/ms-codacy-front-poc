import { render } from '@testing-library/react';
import ModalityUnderConstruction from './ModalityUnderConstruction';

describe('ModalityUnderConstruction', () => {
  it('Should render successfully', () => {
    const { getByText } = render(<ModalityUnderConstruction />);
    expect(getByText('Modalidade em construção')).toBeTruthy();
    expect(
      getByText(
        'Estamos trabalhando no desenvolvimento dessa modalidade. Em breve disponibilizaremos ela para você!',
      ),
    ).toBeTruthy();
  });
});
