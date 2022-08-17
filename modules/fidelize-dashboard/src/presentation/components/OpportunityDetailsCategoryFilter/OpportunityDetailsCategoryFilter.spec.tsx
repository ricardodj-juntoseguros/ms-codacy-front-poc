import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { ModalityEnum } from '../../../application/types/model';
import OpportunityDetailsCategoryFilter from './OpportunityDetailsCategoryFilter';
import { store } from '../../../config/store';

describe('OpportunityDetailsCategoryFilter', () => {
  const mockOptions = [
    {
      value: '5',
      label: 'Bloqueio de conta',
    },
    {
      value: '3',
      label: 'Depósito judicial',
    },
    {
      value: '4',
      label: 'Fiança bancária',
    },
    {
      value: '6',
      label: 'Nova emissão',
    },
    {
      value: '2',
      label: 'Penhora',
    },
    {
      value: '1',
      label: 'Renovação',
    },
  ];

  it('Should render category options accordingly for labor modality', () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsCategoryFilter
          modality={ModalityEnum.TRABALHISTA}
          options={mockOptions}
        />
      </Provider>,
    );
    expect(
      getByTestId('labor-category-filter-chk-multi-1'),
    ).toBeInTheDocument();
    expect(getByText('Renovação')).toBeInTheDocument();
    expect(
      getByTestId('labor-category-filter-chk-multi-2'),
    ).toBeInTheDocument();
    expect(getByText('Penhora')).toBeInTheDocument();
    expect(
      getByTestId('labor-category-filter-chk-multi-3'),
    ).toBeInTheDocument();
    expect(getByText('Depósito judicial')).toBeInTheDocument();
    expect(
      getByTestId('labor-category-filter-chk-multi-4'),
    ).toBeInTheDocument();
    expect(getByText('Fiança bancária')).toBeInTheDocument();
    expect(
      getByTestId('labor-category-filter-chk-multi-5'),
    ).toBeInTheDocument();
    expect(getByText('Bloqueio de conta')).toBeInTheDocument();
    expect(
      getByTestId('labor-category-filter-chk-multi-6'),
    ).toBeInTheDocument();
    expect(getByText('Nova emissão')).toBeInTheDocument();
  });

  it('Should send selected options to store when apply button is clicked', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsCategoryFilter
          modality={ModalityEnum.TRABALHISTA}
          options={mockOptions}
        />
      </Provider>,
    );

    fireEvent.click(getByTestId('labor-category-filter-chk-multi-1'));
    fireEvent.click(getByTestId('labor-category-filter-chk-multi-2'));
    fireEvent.click(getByTestId('labor-category-filter-chk-multi-apply-btn'));

    const {
      opportunityDetails: { settings },
    } = store.getState();

    expect(
      settings
        .find(s => s.modality === ModalityEnum.TRABALHISTA)
        ?.filters.find(f => f.key === 'category')?.values,
    ).toStrictEqual(['1', '2']);
  });
});
