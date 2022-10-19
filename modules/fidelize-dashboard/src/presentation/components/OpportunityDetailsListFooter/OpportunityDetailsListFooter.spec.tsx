import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { OpportunityDetailsItemDTO } from 'modules/fidelize-dashboard/src/application/types/dto';
import {
  OpportunityDetailsCategoryEnum,
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
} from 'modules/fidelize-dashboard/src/application/types/model';
import { useRef } from 'react';
import OpportunityDetailsListFooter from './OpportunityDetailsListFooter';

const mockCallback = jest.fn();

describe('OpportunityDetailsListFooter', () => {
  const WrapperComponent = () => {
    const mockRef = useRef<HTMLDivElement>(null);
    const selectedOpportunitiesMock: OpportunityDetailsItemDTO[] = [
      {
        id: '38bb2d24-6056-4310-a62c-e98b9867d179',
        relevance: OpportunityRelevanceEnum.HIGH,
        type: OpportunityDetailsTypeEnum.LABOR,
        category: OpportunityDetailsCategoryEnum.RENEWAL,
        securityAmount: 50000,
        policyholder: 'Tomador 1',
        expiration: '2024-10-15T03:00:00Z',
        expired: false,
        mappingDate: '2021-09-13T03:00:00Z',
        observation: 'Com vencimento em 15/out/24',
      },
      {
        id: '0c3e0081-8afc-4c32-b6ca-28acf6b406da',
        relevance: OpportunityRelevanceEnum.HIGH,
        type: OpportunityDetailsTypeEnum.LABOR,
        category: OpportunityDetailsCategoryEnum.RENEWAL,
        securityAmount: 20000,
        policyholder: 'Tomador 2',
        expiration: '2024-11-25T03:00:00Z',
        expired: false,
        mappingDate: '2022-04-28T03:00:00Z',
        observation: 'Com vencimento em 25/nov/24',
      },
    ];

    return (
      <>
        <div ref={mockRef} />
        <OpportunityDetailsListFooter
          selectedOpportunities={selectedOpportunitiesMock}
          onMoreDetailsClick={mockCallback}
          listContainerRef={mockRef}
        />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render text correctly according to props', () => {
    const { getByText } = render(<WrapperComponent />);
    expect(getByText('2 selecionados')).toBeInTheDocument();
    expect(getByText(', totalizando R$ 70.000,00 em IS.')).toBeInTheDocument();
  });

  it('Should open selection loss modal when discard button is clicked', () => {
    const { getByTestId, getByText } = render(<WrapperComponent />);
    const button = getByTestId('btn-clear-selection-footer');
    fireEvent.click(button);
    expect(
      getByText('Tem certeza que deseja descartar sua seleção?'),
    ).toBeInTheDocument();
    expect(getByText('Descartar seleção')).toBeInTheDocument();
  });

  it('Should call the callback prop on button click', () => {
    const { getByTestId } = render(<WrapperComponent />);
    const button = getByTestId('btn-more-details-footer');
    fireEvent.click(button);
    expect(mockCallback).toHaveBeenCalled();
  });
});
