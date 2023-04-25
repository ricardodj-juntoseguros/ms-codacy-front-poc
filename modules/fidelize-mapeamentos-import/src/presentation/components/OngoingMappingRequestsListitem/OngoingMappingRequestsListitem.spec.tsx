import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import { RequestMappingRecord } from '../../../application/types/dto';
import OngoingMappingRequestsListitem from './OngoingMappingRequestsListitem';

describe('OngoingMappingRequestsListitem', () => {
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

  const mockCallback = jest.fn();

  it('Should render request date, policyholder and broker columns correctly', () => {
    const { getByText } = render(
      <OngoingMappingRequestsListitem
        mappingRequest={requestMock}
        onRemoveCallback={mockCallback()}
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
      <OngoingMappingRequestsListitem
        mappingRequest={requestMock}
        onRemoveCallback={mockCallback()}
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
      <OngoingMappingRequestsListitem
        mappingRequest={requestMockAux}
        onRemoveCallback={mockCallback}
      />,
    );
    expect(getByText('Urgente')).toBeInTheDocument();
  });

  it('Should render started tag if statusId field is not null', () => {
    const requestMockAux = { ...requestMock, statusId: 1 };
    const { getByText } = render(
      <OngoingMappingRequestsListitem
        mappingRequest={requestMockAux}
        onRemoveCallback={mockCallback}
      />,
    );
    expect(getByText('Iniciado')).toBeInTheDocument();
  });
});
