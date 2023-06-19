import {
  fireEvent,
  render,
  cleanup,
  waitFor,
  findAllByTestId,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'modules/fidelize-mapeamentos-import/src/config/store';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import EditorMappingRequestListitem from './EditorMappingRequestListitem';

const mockCallback = jest.fn();
const mockQueTypes = [
  {
    id: 3,
    name: 'Trabalhista',
    quantity: 3159,
    requested: true,
  },
  {
    id: 4,
    name: 'Federal',
    quantity: 2,
    requested: false,
  },
  {
    id: 5,
    name: 'Estadual',
    quantity: 5955,
    requested: false,
  },
  {
    id: 6,
    name: 'CARF',
    quantity: 0,
    requested: false,
  },
  {
    id: 7,
    name: 'Dívida Ativa',
    quantity: 0,
    requested: false,
  },
];

beforeEach(() => {
  cleanup();
});
describe('EditorMappingRequestListitem', () => {
  const mockPutSuccess = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'putMappingItem')
      .mockImplementation(async () => {
        return { success: true };
      });
  };
  const mockPutError = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'putMappingItem')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          return reject();
        });
      });
  };
  const mockDeleteSuccess = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'deleteMappingItem')
      .mockImplementation(async () => {
        return { success: true };
      });
  };
  const mockDeleteError = () => {
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
          <EditorMappingRequestListitem
            id={1}
            isPriority
            queueTypes={mockQueTypes}
            onChangeCallback={mockCallback}
            policyholderName="Empresa Teste"
          />
        </Provider>
        ,
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
  });

  it('Should performs the complete save flow', async () => {
    mockPutSuccess();
    const { getByTestId } = render(
      <Provider store={store}>
        <EditorMappingRequestListitem
          id={1}
          isPriority
          queueTypes={mockQueTypes}
          onChangeCallback={mockCallback}
          policyholderName="Empresa Teste"
        />
        ,
      </Provider>,
    );

    const btnSave = getByTestId('confirm-update-btn');
    fireEvent.click(btnSave);
    waitFor(() => {
      expect(btnSave).not.toBeTruthy();
    });
  });

  it('Should performs to show delete modal if try set all requests to false on edit', async () => {
    mockDeleteSuccess();
    const { getAllByTestId, findByText } = render(
      <Provider store={store}>
        <EditorMappingRequestListitem
          id={1}
          isPriority
          queueTypes={mockQueTypes}
          onChangeCallback={mockCallback}
          policyholderName="Empresa Teste"
        />
        ,
      </Provider>,
    );

    const checkers = getAllByTestId('checkers');

    fireEvent.click(checkers[0]);
    const titleModal = findByText(
      'Tem certeza que deseja excluir esta solicitação?',
    );
    expect(titleModal).toBeTruthy();
  });

  it('Should hide opportunity editor', async () => {
    mockPutSuccess();
    const { getByTestId } = render(
      <Provider store={store}>
        <EditorMappingRequestListitem
          id={1}
          isPriority
          queueTypes={mockQueTypes}
          onChangeCallback={mockCallback}
          policyholderName="Empresa Teste"
        />
        ,
      </Provider>,
    );

    const btnCancel = getByTestId('cancel-update-btn');
    fireEvent.click(btnCancel);
    waitFor(() => {
      expect(btnCancel).not.toBeTruthy();
    });
  });

  it('Should switch priority', async () => {
    mockPutSuccess();
    const { getByTestId, findByText } = render(
      <Provider store={store}>
        <EditorMappingRequestListitem
          id={1}
          isPriority
          queueTypes={mockQueTypes}
          onChangeCallback={mockCallback}
          policyholderName="Empresa Teste"
        />
        ,
      </Provider>,
    );

    const switchPriority = getByTestId('toggle-status-edit');
    fireEvent.click(switchPriority);
    waitFor(async () => {
      expect(await findByText('Normal')).toBeTruthy();
    });
  });

  it('Should show message error on error', async () => {
    mockPutError();
    const { getByTestId, findByText } = render(
      <Provider store={store}>
        <EditorMappingRequestListitem
          id={1}
          isPriority
          queueTypes={mockQueTypes}
          onChangeCallback={mockCallback}
          policyholderName="Empresa Teste"
        />
        ,
      </Provider>,
    );

    const btnSave = getByTestId('confirm-update-btn');
    fireEvent.click(btnSave);
    waitFor(() => {
      const warnMessage = findByText(
        'Ops, não conseguimos salvar suas alterações. Por favor, tente novamente.',
      );
      expect(warnMessage).toBeTruthy();
    });
  });
});
