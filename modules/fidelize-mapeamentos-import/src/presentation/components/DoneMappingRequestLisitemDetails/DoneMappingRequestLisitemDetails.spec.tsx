import '@testing-library/jest-dom';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import { MappingDoneDetailsDTO } from '../../../application/types/dto';
import DoneMappingRequestsListitemDetails from './DoneMappingRequestListitemDetails';

describe('DoneMappingRequestsListitemDetails', () => {
  const mockSuccess = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'downloadMappingItem')
      .mockImplementation(async () => {
        return Promise.resolve();
      });
  };
  const mockError = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'downloadMappingItem')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          return reject();
        });
      });
  };
  const requestMock: MappingDoneDetailsDTO = {
    id: 4,
    policyholderFederalId: '12345678910114',
    createdAt: '2023-04-13T11:27:42.2819687',
    createdBy: 'Teste User',
    isPriority: false,
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
        name: 'Trabalhista',
        mappedAt: '2023-04-13T11:27:42.8745375',
        requested: true,
        totalProcesses: 6,
        totalOpenProcesses: 2,
        totalOpportunities: 3,
        statusId: 3,
        statusDescription: '',
      },
      {
        id: 4,
        name: 'Federal',
        mappedAt: '',
        requested: true,
        totalProcesses: 6,
        totalOpenProcesses: 2,
        totalOpportunities: 3,
        statusId: 3,
        statusDescription: '',
      },
      {
        id: 5,
        name: 'Estadual',
        mappedAt: '',
        requested: true,
        totalProcesses: 6,
        totalOpenProcesses: 2,
        totalOpportunities: 3,
        statusId: 3,
        statusDescription: '',
      },
      {
        id: 6,
        name: 'CARF',
        mappedAt: '',
        requested: true,
        totalProcesses: 6,
        totalOpenProcesses: 2,
        totalOpportunities: 3,
        statusId: 3,
        statusDescription: '',
      },
      {
        id: 7,
        name: 'Divida Ativa',
        mappedAt: '',
        requested: true,
        totalProcesses: 6,
        totalOpenProcesses: 2,
        totalOpportunities: 3,
        statusId: 3,
        statusDescription: '',
      },
    ],
  };

  it('Should render details rows correctly', () => {
    const { getByText } = render(
      <DoneMappingRequestsListitemDetails mappingRequest={requestMock} />,
    );
    expect(getByText('Trabalhista')).toBeInTheDocument();
    expect(getByText('Federal')).toBeInTheDocument();
    expect(getByText('Estadual')).toBeInTheDocument();
    expect(getByText('CARF')).toBeInTheDocument();
    expect(getByText('Divida Ativa')).toBeInTheDocument();
    expect(getByText('Teste User')).toBeInTheDocument();
  });

  it('Should render all blocks correctly', () => {
    const { getByText } = render(
      <DoneMappingRequestsListitemDetails mappingRequest={requestMock} />,
    );
    expect(
      getByText(
        'Bloqueado por motivo 1; Bloqueado por motivo 2; Bloqueado por motivo 3; Bloqueado por motivo 4.',
      ),
    ).toBeInTheDocument();
  });

  it('Should render download link correctly and get blob file on click', () => {
    mockSuccess();
    const a = document.createElement('a');
    jest
      .spyOn(document, 'createElement')
      .mockReturnValueOnce(document.createElement('a'));
    const dispatchEventSpy = jest.spyOn(a, 'dispatchEvent');
    const { findByText, getByTestId } = render(
      <DoneMappingRequestsListitemDetails mappingRequest={requestMock} />,
    );
    const btnDownloadLink = getByTestId('download-opportunity-btn');
    fireEvent.click(btnDownloadLink);
    const tempLink = findByText('Download - opportunity');
    expect(tempLink).toBeTruthy();
    waitFor(async () => {
      expect(tempLink).toHaveAttribute('href');
      expect(tempLink).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalled();
      expect(tempLink).not.toBeTruthy();
    });
  });

  it('Should return a error message on download error', async () => {
    mockError();
    const { findByText, getByTestId } = render(
      <DoneMappingRequestsListitemDetails mappingRequest={requestMock} />,
    );

    const btnDownloadLink = await getByTestId('download-opportunity-btn');
    fireEvent.click(btnDownloadLink);

    const errorMessage = findByText(
      'Ops, parece que algo deu errado. Tente novamente.',
    );
    expect(errorMessage).toBeTruthy();
  });
});
