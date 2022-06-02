import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { summaryActions } from 'modules/fidelize-dashboard/src/application/features/summary/SummarySlice';
import { store } from '../../../config/store';
import DashboardSummary from '.';

describe('DashboardSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render policyholder total card with store values correctly', async () => {
    const { findByText } = render(
      <Provider store={store}>
        <DashboardSummary />
      </Provider>,
    );

    await act(async () => {
      store.dispatch(summaryActions.setTotalPolicyholders(200));
    });

    expect(await findByText('200')).toBeInTheDocument();
    expect(await findByText('Tomadores')).toBeInTheDocument();
  });

  it('Should render policyholder total card with error if store flag is set to true', async () => {
    const { findByText } = render(
      <Provider store={store}>
        <DashboardSummary />
      </Provider>,
    );

    await act(async () => {
      store.dispatch(summaryActions.setErrorPolicyholders(true));
    });

    expect(
      await findByText(
        'Ocorreu um erro inesperado ao carregar esta informação.',
      ),
    ).toBeTruthy();
  });
});
