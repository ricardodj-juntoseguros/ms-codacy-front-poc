import '@testing-library/jest-dom';
import {
  findByText,
  fireEvent,
  render,
  waitFor,
} from '../../../config/testUtils';
import { DoneMappingRecord } from '../../../application/types/dto';
import DoneMappingRequestsListitem from './DoneMappingRequestsListitem';

describe('DoneMappingRequestsListitem', () => {
  const requestMock: DoneMappingRecord = {
    id: 67,
    policyholderFederalId: '62173620000180',
    policyholderName: 'Teste tomador',
    policyholderEconomicGroupName: 'Teste grupo economico',
    brokerFederalId: '61038592000125',
    brokerName: 'Teste corretora',
    category: 'Big Broker',
    createdAt: '2023-04-14T16:36:38.2423837',
    isPriority: false,
    statusId: 2,
    statusDescription: 'Iniciado',
    mappedAt: null,
    totalProcesses: 600,
    totalOpenProcesses: 274,
    totalOpportunities: 122,
    blocks: [
      {
        id: 1009,
        description: 'Tomador ou Majoritária com Bloqueio',
      },
      {
        id: 1010,
        description: 'Tomador ou Majoritária de porte inválido',
      },
      {
        id: 1011,
        description: 'Tomador sem capacidade de Resseguro',
      },
      {
        id: 1012,
        description: 'Tomador sem limite trabalhista',
      },
      {
        id: 1013,
        description: 'Tomador sem limite financeiro',
      },
    ],
    queueTypes: [
      {
        id: 3,
        name: 'Esteira Trabalhista',
        quantity: 134810,
        requested: true,
      },
      {
        id: 4,
        name: 'Esteira Federal',
        quantity: 15990,
        requested: true,
      },
      {
        id: 5,
        name: 'Esteira Estadual',
        quantity: 353380,
        requested: true,
      },
      {
        id: 6,
        name: 'Esteira CARF',
        quantity: 0,
        requested: true,
      },
      {
        id: 7,
        name: 'Esteira Divida Ativa',
        quantity: 0,
        requested: true,
      },
    ],
    rowsCount: 4,
  };

  it('Should render request date, policyholder and broker columns correctly', () => {
    const { getByText, getByTestId } = render(
      <DoneMappingRequestsListitem mappingRequest={requestMock} />,
    );
    expect(getByText('Iniciado')).toBeInTheDocument();
    expect(getByText('Teste tomador')).toBeInTheDocument();
    expect(getByText('Teste grupo economico')).toBeInTheDocument();
    expect(getByText('Teste corretora')).toBeInTheDocument();
    expect(getByText('600')).toBeInTheDocument();
    expect(getByText('274')).toBeInTheDocument();
    expect(getByText('122')).toBeInTheDocument();
  });

  it('Should render all blocks correctly', () => {
    const { getByText } = render(
      <DoneMappingRequestsListitem mappingRequest={requestMock} />,
    );
    expect(
      getByText('Tomador ou Majoritária com Bloqueio;'),
    ).toBeInTheDocument();
    expect(
      getByText('Tomador ou Majoritária de porte inválido;'),
    ).toBeInTheDocument();
    expect(getByText('Tomador sem limite trabalhista;')).toBeInTheDocument();
    expect(
      getByText('Tomador sem capacidade de Resseguro;'),
    ).toBeInTheDocument();
    expect(getByText('Tomador sem limite financeiro.')).toBeInTheDocument();
  });

  it('Should render popup menu', async () => {
    const { getByTestId } = render(
      <DoneMappingRequestsListitem mappingRequest={requestMock} />,
    );

    const showPopup = getByTestId('show-menu-pop-up');

    fireEvent.mouseOver(showPopup);
    waitFor(async () => {
      const popupMenu = await getByTestId('pop-up-menu');
      expect(popupMenu).toBeInTheDocument();
    });
  });
});
