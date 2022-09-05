import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { opportunitiesDetailsActions } from 'modules/fidelize-dashboard/src/application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import { ModalityEnum } from 'modules/fidelize-dashboard/src/application/types/model';
import { store } from 'modules/fidelize-dashboard/src/config/store';
import { Provider } from 'react-redux';
import OpportunityDetailsSecurityAmountFilter from './OpportunityDetailsSecurityAmountFilter';

describe('OpportunityDetailsSecurityAmountFilter', () => {
  beforeEach(() => {
    store.dispatch(
      opportunitiesDetailsActions.clearFiltersByModality(ModalityEnum.FISCAL),
    );
  });

  it('Should fill inputs and send values to store correctly', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsSecurityAmountFilter
          modality={ModalityEnum.FISCAL}
          filterName="securityAmount"
        />
      </Provider>,
    );

    fireEvent.mouseDown(getByTestId('fiscal-securityAmount-filter'));
    fireEvent.change(getByTestId('min-security-amount-input'), {
      target: { value: '12000' },
    });
    fireEvent.change(getByTestId('max-security-amount-input'), {
      target: { value: '15000' },
    });
    fireEvent.click(getByTestId('security-amount-filter-apply-btn'));

    const storeData = store
      .getState()
      .opportunityDetails.settings.find(s => s.modality === ModalityEnum.FISCAL)
      ?.filters[0];
    expect(storeData?.key).toBe('securityAmount');
    expect(storeData?.values).toStrictEqual({ min: 12000, max: 15000 });
  });

  it('Should clear inputs when button is clicked', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsSecurityAmountFilter
          modality={ModalityEnum.FISCAL}
          filterName="securityAmount"
        />
      </Provider>,
    );

    fireEvent.mouseDown(getByTestId('fiscal-securityAmount-filter'));
    fireEvent.change(getByTestId('min-security-amount-input'), {
      target: { value: '12000' },
    });
    fireEvent.change(getByTestId('max-security-amount-input'), {
      target: { value: '15000' },
    });
    fireEvent.click(getByTestId('security-amount-filter-clear-btn'));
    expect(getByTestId('min-security-amount-input')).toHaveValue('');
    expect(getByTestId('max-security-amount-input')).toHaveValue('');
  });

  it('Should display error message if min value is greater than max', async () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsSecurityAmountFilter
          modality={ModalityEnum.FISCAL}
          filterName="securityAmount"
        />
      </Provider>,
    );

    fireEvent.mouseDown(getByTestId('fiscal-securityAmount-filter'));
    fireEvent.change(getByTestId('min-security-amount-input'), {
      target: { value: '15000' },
    });
    fireEvent.change(getByTestId('max-security-amount-input'), {
      target: { value: '10000' },
    });
    fireEvent.click(getByTestId('security-amount-filter-apply-btn'));
    expect(
      getByText('O valor máximo precisa ser maior que o valor mínimo'),
    ).toBeInTheDocument();
  });
});
