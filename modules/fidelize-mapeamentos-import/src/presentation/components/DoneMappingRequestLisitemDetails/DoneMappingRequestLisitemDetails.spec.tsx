import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import { MappingDoneDetailsDTO } from '../../../application/types/dto';
import DoneMappingRequestsListitemDetails from './DoneMappingRequestListitemDetails';

describe('DoneMappingRequestsListitemDetails', () => {
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
        mappedAt: '2023-04-13T11:27:42.8745375',
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
        mappedAt: '2023-04-13T11:27:42.8745375',
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
        mappedAt: '2023-04-13T11:27:42.8745375',
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
        mappedAt: '2023-04-13T11:27:42.8745375',
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
});
