import { render, fireEvent } from '@testing-library/react';
import NotFoundContainer from '.';

describe('NotFoundContainer', () => {
  const historyMock = jest.fn();

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  it('Should render successfully', () => {
    const component = render(<NotFoundContainer {...props} />);
    expect(
      component.getByText('Ops! A página que você procura não existe.'),
    ).toBeTruthy();
    expect(component.getByText('Voltar para o início')).toBeTruthy();
  });

  it('Should go back to dashboard if button is clicked', () => {
    const component = render(<NotFoundContainer {...props} />);
    const btn = component.getByTestId('go-back-btn');
    fireEvent.click(btn);
    expect(historyMock).toHaveBeenCalledWith('/dashboard');
  });
});
