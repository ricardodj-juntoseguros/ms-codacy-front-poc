import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react';
import {
  ModalityEnum,
  OpportunityDetailsCategoryEnum,
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import { store } from '../../../config/store';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import { opportunitiesDetailsActions } from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import OpportunityDetailsListHeader from '.';
import styles from './OpportunityDetailsListHeader.module.scss';

describe('Opportunity Details List Header', () => {
  it('Should render successfully', () => {
    const { getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsListHeader
          modality={ModalityEnum.FISCAL}
          checkable={false}
          loadingItems={false}
          opportunities={[]}
          totalOpportunities={100}
        />
        ,
      </Provider>,
    );
    expect(getByText('TIPO/OBS.')).toBeTruthy();
    expect(getByText('RELEVÂNCIA')).toBeTruthy();
    expect(getByText('VALOR IS')).toBeTruthy();
    expect(getByText('TOMADOR/GRUPO')).toBeTruthy();
    expect(getByText('DT MAPEAMENTO')).toBeTruthy();
  });

  it('Should change active sorting button when clicked', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsListHeader
          modality={ModalityEnum.FISCAL}
          checkable={false}
          loadingItems={false}
          opportunities={[]}
          totalOpportunities={100}
        />
        ,
      </Provider>,
    );
    const btnClicked = getByTestId('btn-desc-policyholder');

    await act(async () => {
      fireEvent.click(btnClicked);
    });

    expect(btnClicked).toHaveClass(
      styles['opportunity-details-header__order-btn--active'],
    );
    expect(getByTestId('btn-desc-relevance')).not.toHaveClass(
      styles['opportunity-details-header__order-btn--active'],
    );
  });

  it('Should select and deselect all opportunities when checkbox is checked and unchecked', async () => {
    await act(async () => {
      store.dispatch(
        opportunitiesDetailsActions.addOpportunityToSelection({
          id: 'ef8e8952-d54c-4ec2-a4c2-51b007444d4e',
          relevance: OpportunityRelevanceEnum.HIGH,
          type: OpportunityDetailsTypeEnum.LABOR,
          category: OpportunityDetailsCategoryEnum.JUDICIAL_DEPOSIT,
          securityAmount: 9189,
          policyholder: 'DEXCO S.A',
          expiration: null,
          expired: false,
          mappingDate: '2021-10-20T00:00:00Z',
          observation: 'Recurso Ordinário',
          economicGroup: 'GRUPO DEXCO',
        } as OpportunityDetailsItemDTO),
      );
    });

    const mockOpportunities: OpportunityDetailsItemDTO[] = [
      {
        id: 'ffa2ed13-51fe-4869-821f-e1a31cbbe2f5',
        relevance: OpportunityRelevanceEnum.HIGH,
        type: OpportunityDetailsTypeEnum.LABOR,
        category: OpportunityDetailsCategoryEnum.JUDICIAL_DEPOSIT,
        securityAmount: 9828.51,
        policyholder: 'DEXCO S.A',
        expiration: null,
        expired: false,
        mappingDate: '2021-10-20T00:00:00Z',
        observation: 'Recurso Ordinário',
        economicGroup: 'GRUPO DEXCO',
        lastSolicitationDate: null,
      },
      {
        id: 'ff12d784-a782-40dc-8ac7-c44894395be8',
        relevance: OpportunityRelevanceEnum.HIGH,
        type: OpportunityDetailsTypeEnum.LABOR,
        category: OpportunityDetailsCategoryEnum.JUDICIAL_DEPOSIT,
        securityAmount: 9828.51,
        policyholder: 'DEXCO S.A',
        expiration: null,
        expired: false,
        mappingDate: '2021-10-20T00:00:00Z',
        observation: 'Recurso Ordinário',
        economicGroup: 'GRUPO DEXCO',
        lastSolicitationDate: null,
      },
      {
        id: 'facec7c7-2397-4713-8862-f3c5bb724eae',
        relevance: OpportunityRelevanceEnum.HIGH,
        type: OpportunityDetailsTypeEnum.LABOR,
        category: OpportunityDetailsCategoryEnum.JUDICIAL_DEPOSIT,
        securityAmount: 9828.51,
        policyholder: 'DEXCO S.A',
        expiration: null,
        expired: false,
        mappingDate: '2021-10-20T00:00:00Z',
        observation: 'Recurso Ordinário',
        economicGroup: 'GRUPO DEXCO',
        lastSolicitationDate: null,
      },
      {
        id: 'f7db5efc-aa63-43f6-b845-5a5d6ec7ce6d',
        relevance: OpportunityRelevanceEnum.HIGH,
        type: OpportunityDetailsTypeEnum.LABOR,
        category: OpportunityDetailsCategoryEnum.JUDICIAL_DEPOSIT,
        securityAmount: 9828.51,
        policyholder: 'DEXCO S.A',
        expiration: null,
        expired: false,
        mappingDate: '2021-10-20T00:00:00Z',
        observation: 'Recurso Ordinário',
        economicGroup: 'GRUPO DEXCO',
        lastSolicitationDate: null,
      },
      {
        id: 'f1a094e0-adaf-4ff1-a515-cd518980f520',
        relevance: OpportunityRelevanceEnum.HIGH,
        type: OpportunityDetailsTypeEnum.LABOR,
        category: OpportunityDetailsCategoryEnum.JUDICIAL_DEPOSIT,
        securityAmount: 10000,
        policyholder: 'DEXCO S.A',
        expiration: null,
        expired: false,
        mappingDate: '2021-10-20T00:00:00Z',
        observation: 'Recurso Ordinário',
        economicGroup: 'GRUPO DEXCO',
        lastSolicitationDate: null,
      },
      {
        id: 'ef8e8952-d54c-4ec2-a4c2-51b007444d4e',
        relevance: OpportunityRelevanceEnum.HIGH,
        type: OpportunityDetailsTypeEnum.LABOR,
        category: OpportunityDetailsCategoryEnum.JUDICIAL_DEPOSIT,
        securityAmount: 9189,
        policyholder: 'DEXCO S.A',
        expiration: null,
        expired: false,
        mappingDate: '2021-10-20T00:00:00Z',
        observation: 'Recurso Ordinário',
        economicGroup: 'GRUPO DEXCO',
        lastSolicitationDate: null,
      },
    ];

    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsListHeader
          modality={ModalityEnum.LABOR}
          checkable
          loadingItems={false}
          opportunities={mockOpportunities}
          totalOpportunities={6}
        />
      </Provider>,
    );
    const checkbox = getByTestId('chk-select-all');
    fireEvent.click(checkbox);
    expect(
      store.getState().opportunityDetails.selectedOpportunities.length,
    ).toBe(6);

    fireEvent.click(checkbox);
    expect(
      store.getState().opportunityDetails.selectedOpportunities.length,
    ).toBe(0);
  });
});
