import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import MapppingsPanelContainer from './MappingsPanelContainer';

describe('Mapping Panel Container', () => {
  const historyMock = jest.fn();

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <MapppingsPanelContainer {...props} />,
    );

    expect(baseElement).toBeTruthy();
    expect(
      getByText('Olá, acompanhe as solicitações de mapeamento do Fidelize'),
    ).toBeInTheDocument();
    expect(getByText('Na fila')).toBeInTheDocument();
    expect(getByText('Bloqueados')).toBeInTheDocument();
    expect(getByText('Concluídos')).toBeInTheDocument();
  });

  it('Should go to solicitar component if button is clicked', () => {
    const component = render(<MapppingsPanelContainer {...props} />);
    const goToSolicitation = component.getByTestId('btn-goto-solicitation');

    fireEvent.click(goToSolicitation);

    expect(goToSolicitation).toHaveTextContent('Nova solicitação');
    expect(historyMock).toHaveBeenCalledWith('/solicitar');
  });
});
