import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { UploadDocuments } from './UploadDocuments';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('UploadDocuments', () => {
  const historyMock = jest.fn();

  const props = {
    handleGoNextClick: {
      push: historyMock as any,
    } as any,
  };

  beforeEach(() => {
    store.dispatch(
      brokerInformationSliceActions.setFederalId('00124457000108'),
    );
  });

  it('should render successfully', () => {
    const { baseElement, getByTestId, getByText } = render(
      <Provider store={store}>
        <UploadDocuments {...props} />
      </Provider>,
    );
    const submitButton = getByTestId('button-broker-upload');

    expect(baseElement).toBeTruthy();
    expect(getByText('Envio de documentos')).toBeInTheDocument();
    expect(
      getByText('Mande os documentos da corretora para finalizar o cadastro:'),
    ).toBeInTheDocument();
    expect(getByText('Comprovante de endereço')).toBeInTheDocument();
    expect(getByText('Comprovante bancário')).toBeInTheDocument();
    expect(
      getByText(
        'Insira a imagem do cartão ou tela do aplicativo do banco para validação das informações bancárias da corretora.',
      ),
    ).toBeInTheDocument();
    expect(
      getByText('Contrato Social ou Alteração Contratual'),
    ).toBeInTheDocument();
    expect(
      getByText(
        'Envie o documento atualizado e que não tenha mais de 10 anos.',
      ),
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
