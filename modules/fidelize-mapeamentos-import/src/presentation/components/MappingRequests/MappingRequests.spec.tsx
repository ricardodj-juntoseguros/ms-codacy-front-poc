import '@testing-library/jest-dom';
import { MappingStatusEnum } from 'modules/fidelize-mapeamentos-import/src/application/types/model';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import { render } from '../../../config/testUtils';
import MappingRequests from './MappingRequests';

describe('MappingRequests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSuccess = () => {
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

  it('Should render correct list when provided mapping status is ON_QUEUE', async () => {
    mockSuccess();
    const { findByTestId } = render(
      <MappingRequests mappingStatus={MappingStatusEnum.ON_QUEUE} />,
    );
    expect(
      await findByTestId('ongoing-mapping-requests-list'),
    ).toBeInTheDocument();
  });

  it('Should call api method to fetch requests on component mount', async () => {
    mockSuccess();
    const { findByTestId } = render(
      <MappingRequests mappingStatus={MappingStatusEnum.ON_QUEUE} />,
    );
    expect(
      await findByTestId('ongoing-mapping-requests-list'),
    ).toBeInTheDocument();
    expect(ListingMappingApi.prototype.getListingMapping).toHaveBeenCalledTimes(
      1,
    );
  });

  it('Should render error feedback if listing request fails', async () => {
    mockError();
    const { findByText } = render(
      <MappingRequests mappingStatus={MappingStatusEnum.ON_QUEUE} />,
    );
    expect(await findByText('Lista indisponível')).toBeInTheDocument();
  });
});
