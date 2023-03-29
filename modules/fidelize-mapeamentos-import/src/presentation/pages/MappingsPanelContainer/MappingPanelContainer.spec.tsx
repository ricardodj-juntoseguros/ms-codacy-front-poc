import '@testing-library/jest-dom';
import ListingMappingApi from 'modules/fidelize-mapeamentos-import/src/application/features/listingMapping/ListingMappingApi';
import { fireEvent, render } from '../../../config/testUtils';
import MapppingsPanelContainer from './MappingsPanelContainer';

describe('Mapping Panel Container', () => {
  const historyMock = jest.fn();

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  beforeAll(() => {
    jest
      .spyOn(ListingMappingApi.prototype, 'getMappingSummary')
      .mockImplementation(async () => {
        return [
          { status: 'ON_QUEUE', total: 20 },
          { status: 'BLOCKED', total: 10 },
          { status: 'DONE', total: 30 },
        ];
      });
    jest
      .spyOn(ListingMappingApi.prototype, 'getListingMapping')
      .mockImplementation(async () => {
        return {
          hasMore: false,
          hasPrevious: false,
          numberOfRecords: 0,
          pageNumber: 1,
          pageSize: 10,
          records: [],
        };
      });
  });

  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <MapppingsPanelContainer {...props} />,
    );

    expect(baseElement).toBeTruthy();
    expect(
      getByText('Olá, acompanhe as solicitações de mapeamento do Fidelize'),
    ).toBeInTheDocument();
    expect(getByText('Na fila')).toBeInTheDocument();
    expect(getByText('Bloqueados')).toBeInTheDocument();
    expect(getByText('Concluídos')).toBeInTheDocument();
  });

  it('Should go to solicitar component if button is clicked', () => {
    const component = render(<MapppingsPanelContainer {...props} />);
    const goToSolicitation = component.getByTestId('btn-goto-solicitation');

    fireEvent.click(goToSolicitation);

    expect(goToSolicitation).toHaveTextContent('Nova solicitação');
    expect(historyMock).toHaveBeenCalledWith('/solicitar');
  });
});
