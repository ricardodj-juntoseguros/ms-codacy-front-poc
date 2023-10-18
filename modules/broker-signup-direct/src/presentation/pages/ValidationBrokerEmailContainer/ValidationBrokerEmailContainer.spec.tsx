import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import  ValidationBrokerEmailContainer  from './ValidationBrokerEmailContainer';
import { store } from '../../../config/store';

describe('ValidationBrokerEmailContainer component', () => {
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
    <Provider store={store}>
      <ValidationBrokerEmailContainer {...props}/>
    </Provider>);

    expect(baseElement).toBeTruthy();
    expect(getByText('Enviamos um código para o seu e-mail')).toBeInTheDocument();
  });
});
