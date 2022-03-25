import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { store } from '../../../config/store';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import {
  ModalityEnum,
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
              type: 'Fiscal',
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
            },
          ],
        };
      });

    const { findByText } = render(
      <Provider store={store}>
        <OpportunityDetailsList modality={ModalityEnum.FISCAL} />
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
              type: 'Fiscal',
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
            },
          ],
        };
      });

    const { findByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsList modality={ModalityEnum.FISCAL} />
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
              type: 'Fiscal',
              relevance: OpportunityRelevanceEnum.HIGH,
              category: 'Renovação',
              securityAmount: 120000,
              expiration: '2025-03-19T03:00:00.000Z',
              mappingDate: '2022-03-18T03:00:00.000Z',
              policyholder: 'Tomador',
            },
          ],
        };
      });

    const { findByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsList modality={ModalityEnum.FISCAL} />
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
});
