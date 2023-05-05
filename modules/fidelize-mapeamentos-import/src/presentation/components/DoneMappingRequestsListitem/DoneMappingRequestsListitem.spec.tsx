import '@testing-library/jest-dom';
import {
  findByText,
  fireEvent,
  render,
  waitFor,
} from '../../../config/testUtils';
import { DoneMappingRecord } from '../../../application/types/dto';
import DoneMappingRequestsListitem from './DoneMappingRequestsListitem';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';

describe('DoneMappingRequestsListitem', () => {
  const mockSuccess = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'getDetailsListingMapping')
      .mockImplementation(async () => {
        return requestMock;
      });
  };
  const mockError = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'getDetailsListingMapping')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          return reject();
        });
      });
  };

  const mockNotFound = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'getDetailsListingMapping')
      .mockImplementation(async () => {
        return new Promise(() => {
          return requestNotFound;
        });
      });
  };

  const requestNotFound = {
    success: false,
    data: null,
    errors: [
      {
        code: '0',
        message: 'Oportunidade não localizada',
      },
    ],
  };
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
        name: 'Trabalhista',
        quantity: 134810,
        requested: true,
      },
      {
        id: 4,
        name: 'Federal',
        quantity: 15990,
        requested: true,
      },
      {
        id: 5,
        name: 'Estadual',
        quantity: 353380,
        requested: true,
      },
      {
        id: 6,
        name: 'CARF',
        quantity: 0,
        requested: true,
      },
      {
        id: 7,
        name: 'Divida Ativa',
        quantity: 0,
        requested: true,
      },
    ],
    rowsCount: 4,
  };

  it('Should render request date, policyholder and broker columns correctly', () => {
    const { getByText } = render(
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

  it('Should render tooltip with blocks', async () => {
    const { getByTestId, findByText } = render(
      <DoneMappingRequestsListitem mappingRequest={requestMock} />,
    );

    const showTooltip = getByTestId('show-tooltip');

    fireEvent.mouseOver(showTooltip);

    waitFor(async () => {
      expect(
        findByText('Tomador ou Majoritária com Bloqueio;'),
      ).toBeInTheDocument();
      expect(
        findByText('Tomador ou Majoritária de porte inválido;'),
      ).toBeInTheDocument();
      expect(findByText('Tomador sem limite trabalhista;')).toBeInTheDocument();
      expect(
        findByText('Tomador sem capacidade de Resseguro;'),
      ).toBeInTheDocument();
      expect(findByText('Tomador sem limite financeiro.')).toBeInTheDocument();
    });
  });

  it('Should render details on success call details', async () => {
    mockSuccess();
    const { getByTestId, findByText } = render(
      <DoneMappingRequestsListitem mappingRequest={requestMock} />,
    );

    const btnDetails = getByTestId('show-details-btn');

    fireEvent.click(btnDetails);
    waitFor(async () => {
      const itemList = await findByText('Solicitação criada em');
      expect(itemList).toBeInTheDocument();
    });
  });

  it('Should render an alert message when call details with fail', async () => {
    mockError();
    const { getByTestId, findByText } = render(
      <DoneMappingRequestsListitem mappingRequest={requestMock} />,
    );

    const btnDetails = getByTestId('show-details-btn');

    fireEvent.click(btnDetails);
    waitFor(async () => {
      const alertMsg = await findByText(
        'Os detalhes desta solicitação não estão disponíveis no momento. Tente novamente mais tarde.',
      );
      expect(alertMsg).toBeInTheDocument();
    });
  });

  it('Should render an alert message when call with id not founded', async () => {
    mockNotFound();
    const { getByTestId, findByText } = render(
      <DoneMappingRequestsListitem mappingRequest={requestMock} />,
    );

    const btnDetails = getByTestId('show-details-btn');

    fireEvent.click(btnDetails);
    waitFor(async () => {
      const alertMsg = await findByText('Oportunidade não localizada');
      expect(alertMsg).toBeInTheDocument();
    });
  });
});
