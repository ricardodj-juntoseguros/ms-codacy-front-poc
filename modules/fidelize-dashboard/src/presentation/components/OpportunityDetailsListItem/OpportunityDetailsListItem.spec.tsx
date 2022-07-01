import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import {
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import OpportunityDetailsListItem from '.';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';

describe('Opportunity Details List Item', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render accordingly to props', () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2026-01-01T10:00:00.000Z',
      mappingDate: '2022-01-01T10:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      observation: 'Com vencimento em 01/01/26',
    };
    const { getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsListItem
          opportunity={opportunityMock}
          checkable
          onMoreDetailsClick={jest.fn()}
        />
      </Provider>,
    );
    expect(getByText('Renovação')).toBeTruthy();
    expect(getByText('Alta')).toBeTruthy();
    expect(getByText('Com vencimento em 01/01/26')).toBeTruthy();
    expect(getByText('2.550.650,50')).toBeTruthy();
    expect(getByText('Teste tomador')).toBeTruthy();
    expect(getByText('01/jan/22')).toBeTruthy();
  });

  it('Should render "Prazo indeterminado" label if expiration is null', () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.MEDIUM,
      expiration: null,
      mappingDate: '2022-01-01T10:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      observation: 'Prazo indeterminado',
    };
    const { getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsListItem
          opportunity={opportunityMock}
          checkable
          onMoreDetailsClick={jest.fn()}
        />
      </Provider>,
    );
    expect(getByText('Prazo indeterminado')).toBeTruthy();
  });

  it('Should not render expiration if type equals Fiscal and category doesnt allows', () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Penhora',
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.LOW,
      expiration: '2022-02-01T10:00:00.000Z',
      mappingDate: '2022-01-01T10:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      observation: 'Com vencimento em 01/02/22',
    };
    const { queryByText } = render(
      <Provider store={store}>
        <OpportunityDetailsListItem
          opportunity={opportunityMock}
          checkable
          onMoreDetailsClick={jest.fn()}
        />
      </Provider>,
    );
    expect(queryByText('Prazo indeterminado')).not.toBeInTheDocument();
    expect(queryByText('Vencida em 01/02/2022')).not.toBeInTheDocument();
  });

  it('Should render expired message if opportunity is expired', () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.LOW,
      expiration: '2022-02-01T10:00:00.000Z',
      mappingDate: '2022-01-01T10:00:00.000Z',
      securityAmount: 2550650.5,
      expired: true,
      observation: 'Vencida em 01/02/2022',
    };
    const { getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsListItem
          opportunity={opportunityMock}
          checkable
          onMoreDetailsClick={jest.fn()}
        />
      </Provider>,
    );
    expect(getByText('Vencida em 01/02/2022')).toBeTruthy();
  });

  it('Should call onMoreDetailsClick prop callback on trigger button click', () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2026-01-01T10:00:00.000Z',
      mappingDate: '2022-01-01T10:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      observation: 'Com vencimento em 01/01/26',
    };
    const mockCallback = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsListItem
          opportunity={opportunityMock}
          checkable
          onMoreDetailsClick={mockCallback}
        />
      </Provider>,
    );
    const trigger = getByTestId('modal-trigger');
    fireEvent.click(trigger);
    expect(mockCallback).toHaveBeenCalledWith(opportunityMock);
  });

  it('Should hide the trigger button when item checkbox is checked', () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2026-01-01T10:00:00.000Z',
      mappingDate: '2022-01-01T10:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      observation: 'Com vencimento em 01/01/26',
    };
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsListItem
          opportunity={opportunityMock}
          checkable
          onMoreDetailsClick={jest.fn()}
        />
      </Provider>,
    );

    const checkbox = getByTestId('chk-id');
    fireEvent.click(checkbox);
    expect(queryByTestId('modal-trigger')).not.toBeInTheDocument();
    fireEvent.click(checkbox);
    expect(getByTestId('modal-trigger')).toBeInTheDocument();
  });
});
