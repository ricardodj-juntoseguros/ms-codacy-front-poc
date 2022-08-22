import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { ModalityEnum } from '../../../application/types/model';
import OpportunityDetailsMultiselectFilter from './OpportunityDetailsMultiselectFilter';
import { store } from '../../../config/store';

describe('OpportunityDetailsMultiselectFilter', () => {
  const mockOptions = [
    {
      value: '1',
      label: 'Option 01',
    },
    {
      value: '2',
      label: 'Option 02',
    },
    {
      value: '3',
      label: 'Option 03',
    },
    {
      value: '4',
      label: 'Option 04',
    },
    {
      value: '5',
      label: 'Option 05',
    },
    {
      value: '6',
      label: 'Option 06',
    },
  ];

  it('Should render prop options accordingly', () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsMultiselectFilter
          filterName="test"
          modality={ModalityEnum.TRABALHISTA}
          options={mockOptions}
        />
      </Provider>,
    );
    expect(getByTestId('labor-test-filter-chk-multi-1')).toBeInTheDocument();
    expect(getByText('Option 01')).toBeInTheDocument();
    expect(getByTestId('labor-test-filter-chk-multi-2')).toBeInTheDocument();
    expect(getByText('Option 02')).toBeInTheDocument();
    expect(getByTestId('labor-test-filter-chk-multi-3')).toBeInTheDocument();
    expect(getByText('Option 03')).toBeInTheDocument();
    expect(getByTestId('labor-test-filter-chk-multi-4')).toBeInTheDocument();
    expect(getByText('Option 04')).toBeInTheDocument();
    expect(getByTestId('labor-test-filter-chk-multi-5')).toBeInTheDocument();
    expect(getByText('Option 05')).toBeInTheDocument();
    expect(getByTestId('labor-test-filter-chk-multi-6')).toBeInTheDocument();
    expect(getByText('Option 06')).toBeInTheDocument();
  });

  it('Should send selected options to store when apply button is clicked', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsMultiselectFilter
          filterName="test"
          modality={ModalityEnum.TRABALHISTA}
          options={mockOptions}
        />
      </Provider>,
    );

    fireEvent.click(getByTestId('labor-test-filter-chk-multi-1'));
    fireEvent.click(getByTestId('labor-test-filter-chk-multi-2'));
    fireEvent.click(getByTestId('labor-test-filter-chk-multi-apply-btn'));

    const {
      opportunityDetails: { settings },
    } = store.getState();

    expect(
      settings
        .find(s => s.modality === ModalityEnum.TRABALHISTA)
        ?.filters.find(f => f.key === 'test')?.values,
    ).toStrictEqual(['1', '2']);
  });
});
