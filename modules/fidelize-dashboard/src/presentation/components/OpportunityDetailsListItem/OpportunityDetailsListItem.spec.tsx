import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import {
  ModalityEnum,
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import OpportunityDetailsListItem from '.';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';

describe('Opportunity Details List Item', () => {
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
    };
    const { getByText } = render(
      <OpportunityDetailsListItem
        modality={ModalityEnum.FISCAL}
        opportunity={opportunityMock}
      />,
    );
    expect(getByText('Renovação')).toBeTruthy();
    expect(getByText('Alta')).toBeTruthy();
    expect(getByText('Com vencimento em 01/jan/26')).toBeTruthy();
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
    };
    const { getByText } = render(
      <OpportunityDetailsListItem
        modality={ModalityEnum.FISCAL}
        opportunity={opportunityMock}
      />,
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
    };
    const { queryByText } = render(
      <OpportunityDetailsListItem
        modality={ModalityEnum.FISCAL}
        opportunity={opportunityMock}
      />,
    );
    expect(queryByText('Prazo indeterminado')).not.toBeInTheDocument();
    expect(queryByText('Expirada em 01/fev/2022')).not.toBeInTheDocument();
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
    };
    const { getByText } = render(
      <OpportunityDetailsListItem
        modality={ModalityEnum.FISCAL}
        opportunity={opportunityMock}
      />,
    );
    expect(getByText('Expirada em 01/fev/22')).toBeTruthy();
  });
});
