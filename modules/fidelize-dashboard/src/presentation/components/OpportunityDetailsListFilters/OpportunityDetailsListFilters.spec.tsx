import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { ModalityEnum } from '../../../application/types/model';
import { store } from '../../../config/store';
import { opportunitiesDetailsActions } from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import OpportunityDetailsListFilters from './OpportunityDetailsListFilters';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';

describe('OpportunityDetailsListFilters', () => {
  const component = (modality: ModalityEnum) => {
    return render(
      <Provider store={store}>
        <OpportunityDetailsListFilters modality={modality} />
      </Provider>,
    );
  };

  beforeEach(() => {
    jest
      .spyOn(OpportunitiesDetailsApi, 'getFiltersContentByModality')
      .mockImplementationOnce(async () => {
        return {
          filters: [
            {
              filterName: 'category',
              options: [{ label: 'Teste Tipo', value: 'A' }],
            },
            {
              filterName: 'relevance',
              options: [{ label: 'Alta', value: '1' }],
            },
          ],
        };
      });
  });

  it('Should call api method to get filter contents if there is filters to render by modality', async () => {
    const { findByTestId } = component(ModalityEnum.TRABALHISTA);
    expect(await findByTestId('labor-category-filter')).toBeInTheDocument();
    expect(
      await findByTestId('labor-category-filter-chk-multi-A'),
    ).toBeInTheDocument();
    expect(
      OpportunitiesDetailsApi.getFiltersContentByModality,
    ).toHaveBeenCalledWith(ModalityEnum.TRABALHISTA);
  });

  it('Should render filters correctly for modality Labor', async () => {
    const { findByTestId, getByText } = component(ModalityEnum.TRABALHISTA);

    act(() => {
      fireEvent.click(getByText('Filtros'));
    });
    expect(await findByTestId('labor-category-filter')).toBeInTheDocument();
    expect(
      await findByTestId('labor-category-filter-chk-multi-A'),
    ).toBeInTheDocument();
    expect(await findByTestId('labor-relevance-filter')).toBeInTheDocument();
    expect(
      await findByTestId('labor-relevance-filter-chk-multi-1'),
    ).toBeInTheDocument();
    expect(
      await findByTestId('labor-securityAmount-filter'),
    ).toBeInTheDocument();
  });

  it('Should display clear all button when there is any filter applied', async () => {
    const { getByTestId, findByTestId } = component(ModalityEnum.TRABALHISTA);
    await findByTestId('labor-category-filter-chk-multi-A');
    act(() => {
      store.dispatch(
        opportunitiesDetailsActions.setFilter({
          modality: ModalityEnum.TRABALHISTA,
          filter: { key: 'category', values: ['A'] },
        }),
      );
    });
    expect(getByTestId('btn-clear-all-filters')).toBeInTheDocument();
  });

  it('Should clear all filters on store and hide clear button when clicked', async () => {
    const { getByTestId, queryByTestId, findByTestId } = component(
      ModalityEnum.TRABALHISTA,
    );
    await findByTestId('labor-category-filter-chk-multi-A');
    act(() => {
      store.dispatch(
        opportunitiesDetailsActions.setFilter({
          modality: ModalityEnum.TRABALHISTA,
          filter: { key: 'category', values: ['1'] },
        }),
      );
      fireEvent.click(getByTestId('btn-clear-all-filters'));
    });
    expect(queryByTestId('btn-clear-all-filters')).not.toBeInTheDocument();
  });
});
