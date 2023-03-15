import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import  RegisterResponsibleContainer  from './RegisterResponsibleContainer';
import { store } from '../../../config/store';

describe('RegisterResponsibleContainer component', () => {
  const historyMock = jest.fn();

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  it('should render successfully', () => {

    const { baseElement, getByText, getByTestId } = render(
    <Provider store={store}>
      <RegisterResponsibleContainer {...props}/>
    </Provider>);

    expect(baseElement).toBeTruthy();
    expect(getByText('Para começar, precisamos de alguns dados do responsável da corretora')).toBeInTheDocument();
    expect(getByTestId('go-back-btn')).toBeInTheDocument();
  });

  it('Should go back to registerResponsibleContaioner if button is clicked', () => {
    const component = render(
    <Provider store={store}>
      <RegisterResponsibleContainer {...props}/>
    </Provider>);

    const btn = component.getByTestId('go-back-btn');
    fireEvent.click(btn);
    expect(historyMock).toHaveBeenCalledWith('/');
  });
});
