import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import ImportContainer from './ImportContainer';

describe('ImportContainer', () => {
  const historyMock = jest.fn();

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  it('should render successfully', () => {
    const { baseElement, getByText } = render(<ImportContainer {...props} />);

    expect(baseElement).toBeTruthy();
    expect(getByText('Página inicial')).toBeInTheDocument();
  });

  it('Should go to home component if button is clicked', () => {
    const component = render(<ImportContainer {...props} />);
    const goToHome = component.getByTestId('go-to-home');

    fireEvent.click(goToHome);

    expect(historyMock).toHaveBeenCalledWith('/');
  });
});
