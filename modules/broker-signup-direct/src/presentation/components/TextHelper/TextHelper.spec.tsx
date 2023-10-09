import '@testing-library/jest-dom';
import { getByText, render } from '@testing-library/react';
import { TextHelper } from './TextHelper';

describe('TextHelper', () => {
  const textHelper = ["aqui temos um teste de rederização de componente"]

  it('Should render without crashing', () => {
    const { getByText } = render(<TextHelper title="teste componente" text={textHelper} />);

    expect(getByText('teste componente')).toBeInTheDocument();
    expect(getByText('aqui temos um teste de rederização de componente')).toBeInTheDocument();
  });
});
