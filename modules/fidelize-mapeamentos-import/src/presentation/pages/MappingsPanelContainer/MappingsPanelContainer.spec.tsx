import '@testing-library/jest-dom';
import ListingMappingApi from 'modules/fidelize-mapeamentos-import/src/application/features/listingMapping/ListingMappingApi';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import MappingsPanelContainer from './MappingsPanelContainer';
import { store } from '../../../config/store';
import { setEditorId } from '../../../application/features/modalMapping/ModalMappingSlice';

describe('Mapping Panel Container', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  const historyMock = jest.fn();
  const mockSummarySuccess = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'getMappingSummary')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          return resolve(mockSummaryMock);
        });
      });
  };
  const mockSummaryError = () => {
    jest
      .spyOn(ListingMappingApi.prototype, 'getMappingSummary')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          return reject();
        });
      });
  };

  const mockSummaryMock = [
    { total: 4, status: 'BLOCKED' },
    { total: 5, status: 'ON_QUEUE' },
    { total: 37, status: 'DONE' },
  ];

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <Provider store={store}>
        <MappingsPanelContainer {...props} />,
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
    expect(
      getByText('Olá, acompanhe as solicitações de mapeamento do Fidelize'),
    ).toBeInTheDocument();
    expect(getByText('Na fila')).toBeInTheDocument();
    expect(getByText('Para análise')).toBeInTheDocument();
    expect(getByText('Concluídos')).toBeInTheDocument();
  });

  it('Should go to solicitar component if button is clicked', () => {
    const component = render(<MappingsPanelContainer {...props} />);
    const goToSolicitation = component.getByTestId('btn-goto-solicitation');

    store.dispatch(setEditorId({ edit: 0, scroll: 0 }));

    fireEvent.click(goToSolicitation);

    expect(goToSolicitation).toHaveTextContent('Nova solicitação');
    expect(historyMock).toHaveBeenCalledWith('/solicitar');
  });

  it('Should show alert modal to avoid loss data ', () => {
    const component = render(<MappingsPanelContainer {...props} />);
    const goToSolicitation = component.getByTestId('btn-goto-solicitation');

    store.dispatch(setEditorId({ edit: 1, scroll: 0 }));

    fireEvent.click(goToSolicitation);

    waitFor(async () => {
      const titleModal = await component.findByText(
        'A edição de uma solicitação será perdida',
      );
      expect(titleModal).toBeTruthy();

      const discardBtn = component.getByTestId('btn-keep-selection');
      fireEvent.click(discardBtn);
      expect(
        component.queryByText('A edição de uma solicitação será perdida'),
      ).not.toBeInTheDocument();
    });
  });

  it('Should render summary with mocked summary values', async () => {
    mockSummarySuccess();
    const component = render(<MappingsPanelContainer {...props} />);
    const tabOnRow = await component.findByTestId('tab-ON_QUEUE');
    const tabBlocked = await component.findByTestId('tab-BLOCKED');
    const tabDone = await component.findByTestId('tab-DONE');

    waitFor(() => {
      expect(tabOnRow).toHaveTextContent('5');
      expect(tabBlocked).toHaveTextContent('4');
      expect(tabDone).toHaveTextContent('37');
    });
  });

  it('Should render summary with zero values and switch tab', () => {
    mockSummaryError();
    const component = render(<MappingsPanelContainer {...props} />);
    const tabOnRow = component.getByTestId('tab-ON_QUEUE');
    const tabBlocked = component.getAllByTestId('tab-BLOCKED');
    const tabDone = component.getByTestId('tab-DONE');

    fireEvent.click(tabDone);

    waitFor(() => {
      expect(component.getByText('OPORTUNIDADES')).toBeTruthy();
      expect(tabOnRow).toHaveTextContent('0');
      expect(tabBlocked).toHaveTextContent('0');
      expect(tabDone).toHaveTextContent('0');
    });
  });

  it('Should render an alert message when call details with fail', async () => {
    mockSummaryError();
    const { findByText } = render(<MappingsPanelContainer {...props} />);

    waitFor(async () => {
      const alertMsg = await findByText(
        'Alguns dados não estão disponíveis no momento. Tente novamente mais tarde.',
      );
      expect(alertMsg).toBeInTheDocument();
    });
  });
});
