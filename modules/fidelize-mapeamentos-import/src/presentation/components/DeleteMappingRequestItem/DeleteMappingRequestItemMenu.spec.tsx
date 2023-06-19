import { fireEvent, render, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'modules/fidelize-mapeamentos-import/src/config/store';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import DeleteMappingRequestItem from './DeleteMappingRequestItem';

const mockCallback = jest.fn();

beforeEach(() => {
  cleanup();
});
describe('DeleteMappingRequestItem', () => {
  const mockSuccess = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'deleteMappingItem')
      .mockImplementation(async () => {
        return { success: true };
      });
  };
  const mockError = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'deleteMappingItem')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          return reject();
        });
      });
  };
  it('Should render component successfully', async () => {
    const { baseElement } = render(
      <Provider store={store}>
        <DeleteMappingRequestItem
          policyholderName="Teste"
          mappingId={1}
          onChangeCallback={mockCallback}
        />
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
  });

  it('Should performs the complete exclusion flow', async () => {
    mockSuccess();
    const { findByText, findByTestId } = render(
      <Provider store={store}>
        <DeleteMappingRequestItem
          policyholderName="Teste"
          mappingId={1}
          onChangeCallback={mockCallback}
        />
        ,
      </Provider>,
    );

    const modalTitle = await findByText(
      'Tem certeza que deseja excluir esta solicitação?',
    );
    expect(modalTitle).toBeTruthy();

    const btnConfirm = await findByTestId('confirm-exclusion-btn');
    expect(btnConfirm).toBeTruthy();

    fireEvent.click(btnConfirm);

    expect(await findByText('Solicitação excluída!')).toBeTruthy();
  });

  it('Should performs cancel exclusion flow', async () => {
    const { getByTestId, findByText, findByTestId } = render(
      <Provider store={store}>
        <DeleteMappingRequestItem
          policyholderName="Teste"
          mappingId={1}
          onChangeCallback={mockCallback}
        />
        ,
      </Provider>,
    );

    const modalTitle = await findByText(
      'Tem certeza que deseja excluir esta solicitação?',
    );
    expect(modalTitle).toBeTruthy();

    const btnCancel = await findByTestId('cancel-exclusion-btn');
    expect(btnCancel).toBeTruthy();
    setTimeout(() => {
      fireEvent.click(btnCancel);
    }, 300);
    waitFor(async () => expect(modalTitle).not.toBeTruthy());
  });

  it('Should show a retry modal when on error is called', async () => {
    mockError();
    const { findByText, findByTestId } = render(
      <Provider store={store}>
        <DeleteMappingRequestItem
          policyholderName="Teste"
          mappingId={1}
          onChangeCallback={mockCallback}
        />
        ,
      </Provider>,
    );

    const modalTitle = await findByText(
      'Tem certeza que deseja excluir esta solicitação?',
    );
    expect(modalTitle).toBeTruthy();

    const btnConfirm = await findByTestId('confirm-exclusion-btn');
    expect(btnConfirm).toBeTruthy();

    fireEvent.click(btnConfirm);

    waitFor(async () => {
      expect(
        await findByText('Não foi possível excluir a solicitação'),
      ).toBeTruthy();
    });
  });

  it('Should retry exclusion when modal error is showed', async () => {
    mockError();
    const { findByText, findByTestId } = render(
      <Provider store={store}>
        <DeleteMappingRequestItem
          policyholderName="Teste"
          mappingId={1}
          onChangeCallback={mockCallback}
        />
        ,
      </Provider>,
    );

    const modalTitle = await findByText(
      'Tem certeza que deseja excluir esta solicitação?',
    );
    expect(modalTitle).toBeTruthy();

    const btnConfirm = await findByTestId('confirm-exclusion-btn');
    expect(btnConfirm).toBeTruthy();

    fireEvent.click(btnConfirm);

    waitFor(async () => {
      expect(
        await findByText('Não foi possível excluir a solicitação'),
      ).toBeTruthy();

      const btnRetry = await findByTestId('retry-exclusion-btn');
      expect(btnRetry).toBeTruthy();

      fireEvent.click(btnConfirm);
      waitFor(() => expect(modalTitle).not.toBeTruthy());
    });
  });

  it('Should performs the cancel exclusion flow using cancel button', async () => {
    const { findByText, findByTestId } = render(
      <Provider store={store}>
        <DeleteMappingRequestItem
          policyholderName="Teste"
          mappingId={1}
          onChangeCallback={mockCallback}
        />
        ,
      </Provider>,
    );

    const modalTitle = await findByText(
      'Tem certeza que deseja excluir esta solicitação?',
    );
    const btnCancel = await findByTestId('cancel-exclusion-btn');
    expect(btnCancel).toBeTruthy();

    fireEvent.click(btnCancel);
    waitFor(async () => {
      expect(modalTitle).not.toBeTruthy();
    });
  });

  it('Should performs the cancel exclusion flow using close modal button', async () => {
    const { getByTestId, findByText } = render(
      <Provider store={store}>
        <DeleteMappingRequestItem
          policyholderName="Teste"
          mappingId={1}
          onChangeCallback={mockCallback}
        />
        ,
      </Provider>,
    );

    const modalTitle = await findByText(
      'Tem certeza que deseja excluir esta solicitação?',
    );

    const btnCloseModal = getByTestId('modal-close-button');
    expect(btnCloseModal).toBeTruthy();

    fireEvent.click(btnCloseModal);
    waitFor(async () => {
      expect(modalTitle).not.toBeTruthy();
    });
  });

  it('Should performs the cancel exclusion flow using backdrop modal click', async () => {
    const { getByTestId, findByText } = render(
      <Provider store={store}>
        <DeleteMappingRequestItem
          policyholderName="Teste"
          mappingId={1}
          onChangeCallback={mockCallback}
        />
        ,
      </Provider>,
    );

    const modalTitle = await findByText(
      'Tem certeza que deseja excluir esta solicitação?',
    );

    const onBackdrop = getByTestId('modal-backdrop');
    expect(onBackdrop).toBeTruthy();

    fireEvent.click(onBackdrop);
    waitFor(async () => {
      expect(modalTitle).not.toBeTruthy();
    });
  });
});
