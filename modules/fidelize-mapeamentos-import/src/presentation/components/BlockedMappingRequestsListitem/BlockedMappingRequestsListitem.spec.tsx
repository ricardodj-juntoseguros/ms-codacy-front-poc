import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, waitFor } from '../../../config/testUtils';
import { RequestMappingRecord } from '../../../application/types/dto';
import BlockedMappingRequestsListitem from './BlockedMappingRequestsListitem';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';

const mockCallback = jest.fn();

beforeEach(() => {
  cleanup();
});

describe('BlockedMappingRequestsListitem', () => {
  const mockSuccess = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'patchMappingItem')
      .mockImplementation(async () => {
        return { success: true };
      });
  };
  const mockError = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'patchMappingItem')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          return reject();
        });
      });
  };
  const requestMock: RequestMappingRecord = {
    id: 1,
    createdAt: '2023-01-01T12:00:00.00000',
    policyholderFederalId: '11111111111111',
    policyholderName: 'Teste tomador',
    policyholderEconomicGroupName: 'Teste grupo economico',
    brokerFederalId: '12312312312312',
    brokerName: 'Teste corretora',
    category: 'Big Broker',
    isPriority: false,
    statusId: null,
    statusDescription: '',
    rowsCount: 1,
    canUnlock: true,
    blocks: [
      {
        id: 1,
        description: 'Bloqueado por motivo 1',
      },
      {
        id: 2,
        description: 'Bloqueado por motivo 2',
      },
      {
        id: 3,
        description: 'Bloqueado por motivo 3',
      },
      {
        id: 4,
        description: 'Bloqueado por motivo 4',
      },
    ],
    queueTypes: [
      {
        id: 3,
        name: 'Esteira Trabalhista',
        quantity: 875,
        requested: true,
      },
      {
        id: 4,
        name: 'Esteira Federal',
        quantity: 21,
        requested: false,
      },
      {
        id: 5,
        name: 'Esteira Estadual',
        quantity: 866,
        requested: true,
      },
      {
        id: 6,
        name: 'Esteira CARF',
        quantity: 0,
        requested: false,
      },
      {
        id: 7,
        name: 'Esteira Divida Ativa',
        quantity: 0,
        requested: false,
      },
    ],
  };

  it('Should render request date, policyholder and broker columns correctly', () => {
    const { getByText } = render(
      <BlockedMappingRequestsListitem
        mappingRequest={requestMock}
        onChangeCallback={mockCallback()}
      />,
    );
    expect(getByText('01/01/23')).toBeInTheDocument();
    expect(getByText('Teste tomador')).toBeInTheDocument();
    expect(getByText('Teste grupo economico')).toBeInTheDocument();
    expect(getByText('Teste corretora')).toBeInTheDocument();
    expect(getByText('Big Broker')).toBeInTheDocument();
  });

  it('Should render all queue columns correctly', () => {
    const { getByText, getAllByText, getByTestId } = render(
      <BlockedMappingRequestsListitem
        mappingRequest={requestMock}
        onChangeCallback={mockCallback()}
      />,
    );
    expect(getByTestId('1-queue-3-requested')).toBeInTheDocument();
    expect(getByTestId('1-queue-4-not-requested')).toBeInTheDocument();
    expect(getByTestId('1-queue-5-requested')).toBeInTheDocument();
    expect(getByTestId('1-queue-6-not-requested')).toBeInTheDocument();
    expect(getByTestId('1-queue-7-not-requested')).toBeInTheDocument();
    expect(getByText('875')).toBeInTheDocument();
    expect(getByText('21')).toBeInTheDocument();
    expect(getByText('866')).toBeInTheDocument();
    expect(getAllByText('-').length).toBe(2);
  });

  it('Should render priority tag if isPriority field is true', () => {
    const requestMockAux = { ...requestMock, isPriority: true };
    const { getByText } = render(
      <BlockedMappingRequestsListitem
        mappingRequest={requestMockAux}
        onChangeCallback={mockCallback}
      />,
    );
    expect(getByText('Urgente')).toBeInTheDocument();
  });

  it('Should render all blocks correctly', () => {
    const { findByText, getByTestId } = render(
      <BlockedMappingRequestsListitem
        mappingRequest={requestMock}
        onChangeCallback={mockCallback}
      />,
    );
    const showTooltip = getByTestId('show-tooltip');
    fireEvent.mouseOver(showTooltip);

    waitFor(async () => {
      expect(
        findByText(
          'Bloqueado por motivo 1; Bloqueado por motivo 2; Bloqueado por motivo 3; Bloqueado por motivo 4.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('Should performs the complete unblock opportunity flow', async () => {
    mockSuccess();
    const { getByTestId, findByText, findByTestId } = render(
      <BlockedMappingRequestsListitem
        mappingRequest={requestMock}
        onChangeCallback={mockCallback}
      />,
    );
    const btnLink = getByTestId('show-modal-btn');
    fireEvent.click(btnLink);
    const modalTitle = findByText(
      'Tem certeza de que deseja enviar esta solicitação para a fila de mapeamento?',
    );

    expect(modalTitle).toBeTruthy();

    const btnConfirm = await findByTestId('confirm-unblock-btn');
    fireEvent.click(btnConfirm);

    expect(findByText('Solicitação enviada!')).toBeTruthy();
  });

  it('Should performs the cancel unblock flow on close button click', async () => {
    const { getByTestId, findByText } = render(
      <BlockedMappingRequestsListitem
        mappingRequest={requestMock}
        onChangeCallback={mockCallback}
      />,
    );
    const btnLink = getByTestId('show-modal-btn');
    fireEvent.click(btnLink);

    const modalTitle = await findByText(
      'Tem certeza de que deseja enviar esta solicitação para a fila de mapeamento?',
    );
    expect(modalTitle).toBeTruthy();

    const closeButton = getByTestId('modal-close-button');
    expect(closeButton).toBeTruthy();
    fireEvent.click(closeButton);

    waitFor(() => expect(modalTitle).not.toBeTruthy());
  });

  it('Should performs the cancel unblock flow using cancel button', async () => {
    const { getByTestId, findByText, findByTestId } = render(
      <BlockedMappingRequestsListitem
        mappingRequest={requestMock}
        onChangeCallback={mockCallback}
      />,
    );

    const btnLink = getByTestId('show-modal-btn');
    fireEvent.click(btnLink);

    const modalTitle = findByText(
      'Tem certeza de que deseja enviar esta solicitação para a fila de mapeamento?',
    );
    expect(modalTitle).toBeTruthy();

    const btnCancel = await findByTestId('cancel-unblock-btn');
    expect(btnCancel).toBeTruthy();

    fireEvent.click(btnCancel);
    waitFor(() => expect(modalTitle).not.toBeTruthy());
  });

  it('Should show a retry modal when unblock is called with error response and retry once more', async () => {
    mockError();
    const { getByTestId, findByText, findByTestId } = render(
      <BlockedMappingRequestsListitem
        mappingRequest={requestMock}
        onChangeCallback={mockCallback}
      />,
    );

    const btnLink = getByTestId('show-modal-btn');
    fireEvent.click(btnLink);

    const modalTitle = findByText(
      'Tem certeza de que deseja enviar esta solicitação para a fila de mapeamento?',
    );
    expect(modalTitle).toBeTruthy();

    const btnConfirm = await findByTestId('confirm-unblock-btn');
    fireEvent.click(btnConfirm);

    expect(findByText('Não foi possível enviar a solicitação')).toBeTruthy();

    const btnRetry = await findByTestId('retry-unblock-btn');
    fireEvent.click(btnRetry);
    expect(findByText('Não foi possível enviar a solicitação')).toBeTruthy();
  });
});
