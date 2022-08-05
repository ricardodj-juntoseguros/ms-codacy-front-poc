import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ModalityEnum } from '../../../application/types/model';
import { store } from '../../../config/store';
import { opportunitiesDetailsActions } from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import OpportunityDetailsListFilters from './OpportunityDetailsListFilters';

describe('OpportunityDetailsListFilters', () => {
  const component = (modality: ModalityEnum) => {
    return render(
      <Provider store={store}>
        <OpportunityDetailsListFilters modality={modality} />
      </Provider>,
    );
  };

  it('Should render filters correctly for modality Labor', () => {
    const { getByTestId, getByText } = component(ModalityEnum.TRABALHISTA);
    fireEvent.click(getByText('Filtros'));
    expect(getByTestId('labor-category-filter')).toBeInTheDocument();
  });

  it('Should display clear all button when there is any filter applied', () => {
    const { getByTestId } = component(ModalityEnum.TRABALHISTA);
    store.dispatch(
      opportunitiesDetailsActions.setFilter({
        modality: ModalityEnum.TRABALHISTA,
        filter: { key: 'category', values: ['RE'] },
      }),
    );
    expect(getByTestId('btn-clear-all-filters')).toBeInTheDocument();
  });

  it('Should clear all filters on store and hide clear button when clicked', () => {
    const { getByTestId, queryByTestId } = component(ModalityEnum.TRABALHISTA);
    store.dispatch(
      opportunitiesDetailsActions.setFilter({
        modality: ModalityEnum.TRABALHISTA,
        filter: { key: 'category', values: ['RE'] },
      }),
    );
    fireEvent.click(getByTestId('btn-clear-all-filters'));
    expect(queryByTestId('btn-clear-all-filters')).not.toBeInTheDocument();
  });
});
