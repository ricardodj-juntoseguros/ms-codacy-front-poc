import '@testing-library/jest-dom';
import { MappingStatusEnum } from 'modules/fidelize-mapeamentos-import/src/application/types/model';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import { render } from '../../../config/testUtils';
import MappingRequests from './MappingRequests';

describe('MappingRequests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOngoingSuccess = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'getListingMapping')
      .mockImplementation(async () => {
        return {
          hasMore: false,
          hasPrevious: false,
          numberOfRecords: 1,
          pageNumber: 1,
          pageSize: 10,
          records: [
            {
              id: 1,
              createdAt: '2023-01-01T03:00:00',
              policyholderFederalId: 'testeFederalid',
              policyholderName: 'Teste tomador',
              policyholderEconomicGroupName: 'Teste grupo',
              brokerFederalId: 'testeFederalId',
              brokerName: 'Teste corretor',
              category: 'Big Broker',
              isPriority: true,
              statusId: 1,
              statusDescription: 'teste',
              blocks: [],
              queueTypes: [],
              rowsCount: 1,
            },
          ],
        };
      });
  };

  const mockDoneSuccess = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'getListingMapping')
      .mockImplementation(async () => {
        return {
          numberOfRecords: 4,
          hasMore: false,
          hasPrevious: false,
          pageNumber: 1,
          pageSize: 10,
          records: [
            {
              id: 62,
              policyholderFederalId: '02351144000177',
              policyholderName: 'Test name.',
              policyholderEconomicGroupName: 'Test Group',
              brokerFederalId: '65869471000177',
              brokerName: 'Test broker name',
              category: 'Outros',
              createdAt: '2023-04-14T16:36:35.5382848',
              isPriority: false,
              statusId: 2,
              statusDescription: 'Iniciado',
              mappedAt: null,
              totalProcesses: 3,
              totalOpenProcesses: 2,
              totalOpportunities: 1,
              blocks: [],
              queueTypes: [],
              rowsCount: 1,
            },
          ],
        };
      });
  };

  const mockError = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'getListingMapping')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          return reject();
        });
      });
  };

  const mockCallback = jest.fn();

  it('Should render correct list when provided mapping status is ON_QUEUE', async () => {
    mockOngoingSuccess();
    const { findByTestId } = render(
      <MappingRequests
        mappingStatus={MappingStatusEnum.ON_QUEUE}
        onChangeCallback={mockCallback}
      />,
    );
    expect(
      await findByTestId('ongoing-mapping-requests-list'),
    ).toBeInTheDocument();
  });

  it('Should render correct list when provided mapping status is DONE', async () => {
    mockDoneSuccess();
    const { findByTestId } = render(
      <MappingRequests mappingStatus={MappingStatusEnum.DONE} />,
    );
    expect(
      await findByTestId('done-mapping-requests-list'),
    ).toBeInTheDocument();
  });

  it('Should call api method to fetch requests on component ongoing mount', async () => {
    mockOngoingSuccess();
    const { findByTestId } = render(
      <MappingRequests
        mappingStatus={MappingStatusEnum.ON_QUEUE}
        onChangeCallback={mockCallback}
      />,
    );
    expect(
      await findByTestId('ongoing-mapping-requests-list'),
    ).toBeInTheDocument();
    expect(ListingMappingApi.prototype.getListingMapping).toHaveBeenCalledTimes(
      1,
    );
  });

  it('Should call api method to fetch requests on component blocked mount', async () => {
    mockOngoingSuccess();
    const { findByTestId } = render(
      <MappingRequests
        mappingStatus={MappingStatusEnum.BLOCKED}
        onChangeCallback={mockCallback}
      />,
    );
    expect(
      await findByTestId('blocked-mapping-requests-list'),
    ).toBeInTheDocument();
    expect(ListingMappingApi.prototype.getListingMapping).toHaveBeenCalledTimes(
      1,
    );
  });

  it('Should call api method to fetch requests on component done mount', async () => {
    mockDoneSuccess();
    const { findByTestId } = render(
      <MappingRequests mappingStatus={MappingStatusEnum.DONE} />,
    );
    expect(
      await findByTestId('done-mapping-requests-list'),
    ).toBeInTheDocument();
    expect(ListingMappingApi.prototype.getListingMapping).toHaveBeenCalledTimes(
      1,
    );
  });

  it('Should render error feedback if listing request fails', async () => {
    mockError();
    const { findByText } = render(
      <MappingRequests
        mappingStatus={MappingStatusEnum.ON_QUEUE}
        onChangeCallback={mockCallback}
      />,
    );
    expect(await findByText('Lista indisponível')).toBeInTheDocument();
  });
});
