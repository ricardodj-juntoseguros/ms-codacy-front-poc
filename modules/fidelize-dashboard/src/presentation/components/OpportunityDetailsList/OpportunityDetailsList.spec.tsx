import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { store } from '../../../config/store';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import {
  ModalityEnum,
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import OpportunityDetailsList from './OpportunityDetailsList';

describe('OpportunityDetailsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch opportunity details on component mount', async () => {
    const apiMock = jest
      .spyOn(OpportunitiesDetailsApi, 'getOpportunitiesDetailsByModality')
      .mockImplementation(async () => {
        return {
          totalCount: 100,
          data: [
            {
              id: 'id',
              type: OpportunityDetailsTypeEnum.FISCAL,
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
              expired: false,
              observation: 'Com vencimento em 19/03/25',
            },
          ],
        };
      });

    const { findByText } = render(
      <Provider store={store}>
        <OpportunityDetailsList
          multipleSelection={false}
          modality={ModalityEnum.FISCAL}
        />
      </Provider>,
    );
    expect(
      await findByText('100 oportunidades listadas, incluindo expiradas'),
    ).toBeTruthy();
    expect(await findByText('Detalhes das oportunidades fiscais')).toBeTruthy();
    expect(apiMock).toHaveBeenCalledTimes(1);
  });

  it('should fetch opportunity details on pagination change', async () => {
    const apiMock = jest
      .spyOn(OpportunitiesDetailsApi, 'getOpportunitiesDetailsByModality')
      .mockImplementation(async () => {
        return {
          totalCount: 100,
          data: [
            {
              id: 'id',
              type: OpportunityDetailsTypeEnum.FISCAL,
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
              expired: false,
              observation: 'Com vencimento em 19/03/25',
            },
          ],
        };
      });

    const { findByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsList
          multipleSelection={false}
          modality={ModalityEnum.FISCAL}
        />
      </Provider>,
    );
    const btn = await findByTestId('pagination-next-btn');
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(apiMock).toHaveBeenCalledTimes(2);
  });

  it('should fetch opportunity details on page size select', async () => {
    const apiMock = jest
      .spyOn(OpportunitiesDetailsApi, 'getOpportunitiesDetailsByModality')
      .mockImplementation(async () => {
        return {
          totalCount: 100,
          data: [
            {
              id: 'id',
              type: OpportunityDetailsTypeEnum.FISCAL,
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
              expired: false,
              observation: 'Com vencimento em 19/03/25',
            },
          ],
        };
      });

    const { findByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsList
          multipleSelection={false}
          modality={ModalityEnum.FISCAL}
        />
      </Provider>,
    );
    const optionToSelect = await (
      await findByTestId('dropdown-input-list')
    ).children[1];
    await act(async () => {
      fireEvent.click(optionToSelect);
    });
    expect(apiMock).toHaveBeenCalledTimes(2);
  });

  it('should fetch opportunity details on order change', async () => {
    const apiMock = jest
      .spyOn(OpportunitiesDetailsApi, 'getOpportunitiesDetailsByModality')
      .mockImplementation(async () => {
        return {
          totalCount: 100,
          data: [
            {
              id: 'id',
              type: OpportunityDetailsTypeEnum.FISCAL,
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
              expired: false,
              observation: 'Com vencimento em 19/03/25',
            },
          ],
        };
      });

    const { findByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsList
          multipleSelection={false}
          modality={ModalityEnum.FISCAL}
        />
      </Provider>,
    );
    const optionToSelect = await await findByTestId('btn-asc-policyholder');
    await act(async () => {
      fireEvent.click(optionToSelect);
    });
    expect(apiMock).toHaveBeenCalledTimes(2);
  });

  it('Should open opportunity details modal when button on item is clicked', async () => {
    jest
      .spyOn(OpportunitiesDetailsApi, 'getOpportunitiesDetailsByModality')
      .mockImplementation(async () => {
        return {
          totalCount: 100,
          data: [
            {
              id: 'id',
              type: OpportunityDetailsTypeEnum.FISCAL,
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
              expired: false,
              observation: 'Com vencimento em 19/03/25',
            },
          ],
        };
      });

    const { findByTestId, getByText, queryByText } = render(
      <Provider store={store}>
        <OpportunityDetailsList
          multipleSelection={false}
          modality={ModalityEnum.FISCAL}
        />
      </Provider>,
    );

    const modalTrigger = await findByTestId('modal-trigger');
    await act(async () => {
      fireEvent.click(modalTrigger);
    });

    expect(getByText('Quero mais detalhes!')).toBeInTheDocument();
    expect(getByText('Oportunidade fiscal selecionada:')).toBeInTheDocument();

    const closeModalBtn = await findByTestId('modal-close-button');
    await act(async () => {
      fireEvent.click(closeModalBtn);
    });

    expect(queryByText('Quero mais detalhes!')).not.toBeInTheDocument();
  });

  it('Should open more opportunity details modal when one opportunity is selected and footer button is clicked', async () => {
    jest
      .spyOn(OpportunitiesDetailsApi, 'getOpportunitiesDetailsByModality')
      .mockImplementation(async () => {
        return {
          totalCount: 100,
          data: [
            {
              id: 'id',
              type: OpportunityDetailsTypeEnum.LABOR,
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
              expired: false,
              observation: 'Com vencimento em 19/03/25',
            },
            {
              id: 'id2',
              type: OpportunityDetailsTypeEnum.LABOR,
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 10000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador 2',
              expired: false,
              observation: 'Com vencimento em 19/03/25',
            },
          ],
        };
      });

    const { findByTestId, getByTestId, getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsList
          multipleSelection
          modality={ModalityEnum.TRABALHISTA}
        />
      </Provider>,
    );

    const checkbox1 = await findByTestId('chk-id');
    const checkbox2 = await findByTestId('chk-id2');

    await act(async () => {
      fireEvent.click(checkbox1);
      fireEvent.click(checkbox2);
    });

    const footerButton = getByTestId('btn-more-details-footer');

    await act(async () => {
      fireEvent.click(footerButton);
    });

    expect(getByText('Quero mais detalhes!')).toBeInTheDocument();
    expect(
      getByText(
        'Você selecionou 2 oportunidades para obter mais detalhes. Clique no botão abaixo que te retornaremos com as informações adicionais (como número de CNJ, entre outras)',
      ),
    ).toBeInTheDocument();
  });
});
