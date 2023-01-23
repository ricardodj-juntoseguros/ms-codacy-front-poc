import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { opportunitiesDetailsActions } from 'modules/fidelize-dashboard/src/application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import { ModalityEnum } from 'modules/fidelize-dashboard/src/application/types/model';
import { store } from 'modules/fidelize-dashboard/src/config/store';
import { Provider } from 'react-redux';
import OpportunityDetailsMappingDateFilter from './OpportunityDetailsMappingDateFilter';

describe('OpportunityDetailsMappingDateFilter', () => {
  beforeEach(() => {
    store.dispatch(
      opportunitiesDetailsActions.clearFiltersByModality(ModalityEnum.FISCAL),
    );
  });

  it('Should fill inputs and send values to store correctly', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsMappingDateFilter
          modality={ModalityEnum.FISCAL}
          filterName="mappingDate"
        />
      </Provider>,
    );

    fireEvent.mouseDown(getByTestId('fiscal-mappingDate-filter'));
    fireEvent.change(getByTestId('min-mapping-date-input'), {
      target: { value: '01/01/2023' },
    });
    fireEvent.change(getByTestId('max-mapping-date-input'), {
      target: { value: '01/02/2023' },
    });
    fireEvent.click(getByTestId('mapping-date-filter-apply-btn'));

    const storeData = store
      .getState()
      .opportunityDetails.settings.find(s => s.modality === ModalityEnum.FISCAL)
      ?.filters[0];
    expect(storeData?.key).toBe('mappingDate');
    expect(storeData?.values).toStrictEqual({
      min: '2023-01-01',
      max: '2023-02-01',
    });
  });

  it('Should clear inputs when button is clicked', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsMappingDateFilter
          modality={ModalityEnum.FISCAL}
          filterName="mappingDate"
        />
      </Provider>,
    );

    fireEvent.mouseDown(getByTestId('fiscal-mappingDate-filter'));
    fireEvent.change(getByTestId('min-mapping-date-input'), {
      target: { value: '01/01/2023' },
    });
    fireEvent.change(getByTestId('max-mapping-date-input'), {
      target: { value: '01/02/2023' },
    });
    fireEvent.click(getByTestId('mapping-date-filter-clear-btn'));
    expect(getByTestId('min-mapping-date-input')).toHaveValue('');
    expect(getByTestId('max-mapping-date-input')).toHaveValue('');
  });

  it('Should display error message if min value is greater than max', async () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsMappingDateFilter
          modality={ModalityEnum.FISCAL}
          filterName="mappingDate"
        />
      </Provider>,
    );

    fireEvent.mouseDown(getByTestId('fiscal-mappingDate-filter'));
    fireEvent.change(getByTestId('min-mapping-date-input'), {
      target: { value: '01/02/2023' },
    });
    fireEvent.change(getByTestId('max-mapping-date-input'), {
      target: { value: '01/01/2023' },
    });
    fireEvent.click(getByTestId('mapping-date-filter-apply-btn'));
    expect(
      getByText('A data final deve ser posterior a data inicial!'),
    ).toBeInTheDocument();
  });
});
