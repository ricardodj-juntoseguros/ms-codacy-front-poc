import { fireEvent, render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { UploadDocuments } from './UploadDocuments';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('UploadDocuments', () => {
  const historyMock = jest.fn();

  const contractSocialMock = new File(['(⌐□_□)'], 'contractSocialMock.pdf', {
    type: 'application/pdf',
  });

  const proofAddressMock = new File(['(⌐□_□)'], 'proofAddressMock.pdf', {
    type: 'application/pdf',
  });
  const proofBankDetailsMock = new File(
    ['(⌐□_□)'],
    'proofBankDetailsMock.pdf',
    {
      type: 'application/pdf',
    },
  );

  const props = {
    handleGoNextClick: {
      push: historyMock as any,
    } as any,
    handleSubmit: jest.fn(),
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

  it('should be able to upload the necessary documents', async () => {
    const { getByText, getAllByTestId, getByTestId } = render(
      <Provider store={store}>
        <UploadDocuments {...props} />
      </Provider>,
    );

    const btnSubmit = getByTestId('button-broker-upload');
    const input = getAllByTestId('input-files');

    await act(async () => {
      fireEvent.change(input[0], { target: { files: [contractSocialMock] } });
      fireEvent.change(input[1], { target: { files: [proofAddressMock] } });
      fireEvent.change(input[2], { target: { files: [proofBankDetailsMock] } });
    });

    fireEvent.click(btnSubmit);

    expect(getByText('contractSocialMock.pdf')).toBeInTheDocument();
    expect(getByText('proofAddressMock.pdf')).toBeInTheDocument();
    expect(getByText('proofBankDetailsMock.pdf')).toBeInTheDocument();
  });

  it('should be able to delete a file', async () => {
    const { getByText, getAllByTestId } = render(
      <Provider store={store}>
        <UploadDocuments {...props} />
      </Provider>,
    );

    const input = getAllByTestId('input-files');

    await act(async () => {
      fireEvent.change(input[0], { target: { files: [contractSocialMock] } });
      fireEvent.change(input[1], { target: { files: [proofAddressMock] } });
      fireEvent.change(input[2], { target: { files: [proofBankDetailsMock] } });
    });

    expect(getByText('contractSocialMock.pdf')).toBeInTheDocument();
    expect(getByText('proofAddressMock.pdf')).toBeInTheDocument();
    expect(getByText('proofBankDetailsMock.pdf')).toBeInTheDocument();

    await act(async () => {
      fireEvent.pointerEnter(getByText('contractSocialMock.pdf'));
      fireEvent.pointerEnter(getByText('proofAddressMock.pdf'));
      fireEvent.pointerEnter(getByText('proofBankDetailsMock.pdf'));

      const removeBtn = getAllByTestId('remove-file');

      fireEvent.click(removeBtn[0]);
      fireEvent.click(removeBtn[1]);
      fireEvent.click(removeBtn[2]);
    });

    expect.not.stringContaining('contractSocialMock.pdf');
    expect.not.stringContaining('proofAddressMock.pdf');
    expect.not.stringContaining('proofBankDetailsMock.pdf');
  });
});
