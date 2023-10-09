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

    const { baseElement, getByText } = render(
    <Provider store={store}>
      <RegisterResponsibleContainer {...props}/>
    </Provider>);

    expect(baseElement).toBeTruthy();
    expect(getByText('Informe seu nome e e-mail')).toBeInTheDocument();
  });
});
