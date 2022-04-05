import { fireEvent, getByTestId, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { PolicyholderDTO } from '../../../application/types/dto';
import PolicyholderFilterApi from '../../../application/features/policyholderFilter/PolicyholderFilterApi';
import PolicyholderFilterSelector from '.';
import { store } from '../../../config/store';

describe('PolicyholderFilterSelector', () => {
  beforeAll(() => {
    jest
      .spyOn(PolicyholderFilterApi, 'getMappedPolicyholderList')
      .mockImplementation(async () => {
        return [
          {
            federalId: '28545732000186',
            name: 'Coca-Cola do Brasil',
          },
          {
            federalId: '00554000000133',
            name: 'Metalúrgica São Braz',
          },
          {
            federalId: '47008754000151',
            name: 'ASTRAZENECA DO BRASIL LTDA',
          },
          {
            federalId: '51485949000160',
            name: 'DHL LOGISTICS',
          },
        ] as PolicyholderDTO[];
      });
  });

  it('Should fetch policyholder list on mount', async () => {
    const { findByText } = render(
      <Provider store={store}>
        <PolicyholderFilterSelector />
      </Provider>,
    );

    expect(
      await findByText('Coca-Cola do Brasil - 28.545.732/0001-86'),
    ).toBeInTheDocument();
    expect(
      await findByText('Metalúrgica São Braz - 00.554.000/0001-33'),
    ).toBeInTheDocument();
    expect(
      await findByText('ASTRAZENECA DO BRASIL LTDA - 47.008.754/0001-51'),
    ).toBeInTheDocument();
    expect(
      await findByText('DHL LOGISTICS - 51.485.949/0001-60'),
    ).toBeInTheDocument();
    expect(
      PolicyholderFilterApi.getMappedPolicyholderList,
    ).toHaveBeenCalledTimes(1);
  });

  it('Should filter options on input change', async () => {
    const { queryByText, findByTestId } = render(
      <Provider store={store}>
        <PolicyholderFilterSelector />
      </Provider>,
    );

    const input = await (
      await findByTestId('search-input')
    ).querySelectorAll('input')[0];

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Brasil' } });
    });

    expect(
      queryByText('Coca-Cola do Brasil - 28.545.732/0001-86'),
    ).toBeInTheDocument();
    expect(
      queryByText('ASTRAZENECA DO BRASIL LTDA - 47.008.754/0001-51'),
    ).toBeInTheDocument();
    expect(
      queryByText('Metalúrgica São Braz - 00.554.000/0001-33'),
    ).not.toBeInTheDocument();
    expect(
      queryByText('DHL LOGISTICS - 51.485.949/0001-60'),
    ).not.toBeInTheDocument();
  });

  it('Should add policyholder tag to selection and enable apply button when selected on list', async () => {
    const { findByText, getByText, getByTestId } = render(
      <Provider store={store}>
        <PolicyholderFilterSelector />
      </Provider>,
    );

    const option = await findByText('Coca-Cola do Brasil - 28.545.732/0001-86');
    await act(async () => {
      fireEvent.click(option);
    });
    expect(getByText('Coca-Cola do Brasil')).toBeInTheDocument();
    expect(getByTestId('btn-apply-filter')).toBeEnabled();
  });

  it('Should disable apply button when selection is applied', async () => {
    const { findByText, getByText, getByTestId } = render(
      <Provider store={store}>
        <PolicyholderFilterSelector />
      </Provider>,
    );

    const option = await findByText('Coca-Cola do Brasil - 28.545.732/0001-86');
    const applyBtn = getByTestId('btn-apply-filter');
    await act(async () => {
      fireEvent.click(option);
    });
    expect(getByText('Coca-Cola do Brasil')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(applyBtn);
    });
    expect(getByTestId('btn-apply-filter')).toBeDisabled();
  });

  it('Should remove selected policyholder on tag button click', async () => {
    const { findByText, getByText, queryByText } = render(
      <Provider store={store}>
        <PolicyholderFilterSelector />
      </Provider>,
    );
    const option = await findByText('Coca-Cola do Brasil - 28.545.732/0001-86');
    await act(async () => {
      fireEvent.click(option);
    });
    expect(getByText('Coca-Cola do Brasil')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(
        getByText('Coca-Cola do Brasil').querySelectorAll('button')[0],
      );
    });
    expect(queryByText('Coca-Cola do Brasil')).not.toBeInTheDocument();
  });

  it('Should clear all selection on component and store on clear button click', async () => {
    const { findByText, getByText, queryByText, getByTestId } = render(
      <Provider store={store}>
        <PolicyholderFilterSelector />
      </Provider>,
    );
    const option = await findByText('Coca-Cola do Brasil - 28.545.732/0001-86');
    await act(async () => {
      fireEvent.click(option);
    });

    expect(getByText('Coca-Cola do Brasil')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByTestId('btn-clear-policyholders'));
    });

    expect(queryByText('Coca-Cola do Brasil')).not.toBeInTheDocument();
    expect(getByTestId('btn-apply-filter')).toBeDisabled();
  });
});
