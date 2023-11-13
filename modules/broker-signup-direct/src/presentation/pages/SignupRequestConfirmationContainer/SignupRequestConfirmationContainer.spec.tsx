import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import SignupRequestConfirmationContainer from './SignupRequestConfirmationContainer';
import { store } from '../../../config/store';

describe('SignupRequestConfirmationContainer component', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <Provider store={store}>
        <SignupRequestConfirmationContainer />
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
    expect(getByText('Cadastro solicitado!')).toBeInTheDocument();
    expect(
      getByText(
        'Fique de olho, entraremos em contato com você. As instruções para criação do seu acesso serão enviadas por e-mail.',
      ),
    ).toBeInTheDocument();
  });
});
