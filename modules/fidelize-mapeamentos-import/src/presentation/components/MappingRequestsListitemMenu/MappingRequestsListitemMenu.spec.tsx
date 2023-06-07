import { fireEvent, render, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'modules/fidelize-mapeamentos-import/src/config/store';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import MappingRequestsListitemMenu from './MappingRequestsListitemMenu';

const mockCallback = jest.fn();

beforeEach(() => {
  cleanup();
});
describe('MappingRequestsListitemMenu', () => {
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
        <Provider store={store}>
          <MappingRequestsListitemMenu
            policyholderName="Teste"
            mappingId={1}
            onRemoveCallback={mockCallback}
          />
        </Provider>
        ,
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
  });

  it('Should performs the complete exclusion flow', async () => {
    mockSuccess();
    const { getByTestId, findByText, findByTestId } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');

    fireEvent.click(btnLink);
    const btnRemove = await findByTestId('remove-item-btn');

    fireEvent.click(btnRemove);
    const modalTitle = await findByText(
      'Tem certeza que deseja excluir esta solicitação?',
    );
    expect(modalTitle).toBeTruthy();

    const btnConfirm = await findByTestId('confirm-exclusion-btn');
    expect(btnConfirm).toBeTruthy();

    fireEvent.click(btnConfirm);

    expect(await findByText('Solicitação excluída!')).toBeTruthy();
  });

  it('Should call and show opportunity editor ', async () => {
    const { getByTestId, findByTestId } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');

    fireEvent.click(btnLink);
    const btnEditor = await findByTestId('edit-item-btn');

    fireEvent.click(btnEditor);
    waitFor(async () => {
      const btnConfirm = await findByTestId('confirm-update-btn');
      expect(btnConfirm).toBeTruthy();
    });
  });

  it('Should hide opportunity editor and show list opportunity ', async () => {
    const { getByTestId, findByTestId } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');

    fireEvent.click(btnLink);
    const btnEditor = await findByTestId('edit-item-btn');

    fireEvent.click(btnEditor);
    waitFor(async () => {
      const btnCancel = await findByTestId('cancel-update-btn');
      expect(btnCancel).toBeTruthy();
      fireEvent.click(btnCancel);
      expect(btnCancel).not.toBeTruthy();
    });
  });

  it('Should show a retry modal when on error is called', async () => {
    mockError();
    const { getByTestId, findByText, findByTestId } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');

    fireEvent.click(btnLink);
    const btnRemove = await findByTestId('remove-item-btn');

    fireEvent.click(btnRemove);
    waitFor(async () => {
      const modalTitle = await findByText(
        'Tem certeza que deseja excluir esta solicitação?',
      );
      expect(modalTitle).toBeTruthy();

      const btnConfirm = await findByTestId('confirm-exclusion-btn');
      expect(btnConfirm).toBeTruthy();

      fireEvent.click(btnConfirm);

      expect(
        await findByText('Não foi possível excluir a solicitação'),
      ).toBeTruthy();
    });
  });

  it('Should retry exclusion when modal error is showed', async () => {
    const { getByTestId, findByText, findByTestId } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');

    fireEvent.click(btnLink);
    const btnRemove = await findByTestId('remove-item-btn');

    fireEvent.click(btnRemove);

    waitFor(async () => {
      const modalTitle = await findByText(
        'Tem certeza que deseja excluir esta solicitação?',
      );
      expect(modalTitle).toBeTruthy();

      const btnConfirm = await findByTestId('confirm-exclusion-btn');
      expect(btnConfirm).toBeTruthy();

      fireEvent.click(btnConfirm);
      mockError();

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
    const { getByTestId, findByText, findByTestId } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');
    fireEvent.click(btnLink);

    const btnRemove = await findByTestId('remove-item-btn');
    fireEvent.click(btnRemove);

    waitFor(async () => {
      const modalTitle = await findByText(
        'Tem certeza que deseja excluir esta solicitação?',
      );
      const btnCancel = await findByTestId('cancel-exclusion-btn');
      expect(btnCancel).toBeTruthy();

      fireEvent.click(btnCancel);
      expect(modalTitle).not.toBeTruthy();
    });
  });

  it('Should performs the cancel exclusion flow using close modal button', async () => {
    const { getByTestId, findByText, findByTestId } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');
    fireEvent.click(btnLink);

    const btnRemove = await findByTestId('remove-item-btn');
    fireEvent.click(btnRemove);
    waitFor(async () => {
      const modalTitle = await findByText(
        'Tem certeza que deseja excluir esta solicitação?',
      );

      const btnCloseModal = getByTestId('modal-close-button');
      expect(btnCloseModal).toBeTruthy();

      fireEvent.click(btnCloseModal);
      expect(modalTitle).not.toBeTruthy();
    });
  });

  it('Should performs the cancel exclusion flow using backdrop modal click', async () => {
    const { getByTestId, findByText, findByTestId } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');
    fireEvent.click(btnLink);

    const btnRemove = await findByTestId('remove-item-btn');
    fireEvent.click(btnRemove);
    waitFor(async () => {
      const modalTitle = await findByText(
        'Tem certeza que deseja excluir esta solicitação?',
      );

      const onBackdrop = getByTestId('modal-backdrop');
      expect(onBackdrop).toBeTruthy();

      fireEvent.click(onBackdrop);
      expect(modalTitle).not.toBeTruthy();
    });
  });

  it('Should hide drop menu when click on disabled link', async () => {
    const { getByTestId, findByText } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');
    fireEvent.click(btnLink);

    const btnRemove = await findByText('Editar solicitação');
    fireEvent.click(btnRemove);

    waitFor(() => expect(btnRemove).not.toBeTruthy());
  });

  it('Should hide drop menu when mouse leave', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <MappingRequestsListitemMenu
          policyholderName="Teste"
          mappingId={1}
          onRemoveCallback={mockCallback}
          canEdit
        />
        ,
      </Provider>,
    );

    const btnLink = getByTestId('show-menu-btn');
    fireEvent.click(btnLink);

    const listMenu = await getByTestId('list-menu');
    fireEvent.mouseLeave(listMenu);

    waitFor(() => expect(listMenu).not.toBeTruthy());
  });
});
