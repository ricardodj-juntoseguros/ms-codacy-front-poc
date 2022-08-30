import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { summaryActions } from 'modules/fidelize-dashboard/src/application/features/summary/SummarySlice';
import { store } from '../../../config/store';
import DashboardSummary from '.';
import { policyholderFilterActions } from '../../../application/features/policyholderFilter/PolicyholderFilterSlice';

describe('DashboardSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render policyholder total card with store values correctly', async () => {
    const { findByText } = render(
      <Provider store={store}>
        <DashboardSummary
          totalOpportunities={undefined}
          totalInsuredAmount={undefined}
          errorModalitySummary={false}
        />
      </Provider>,
    );

    await act(async () => {
      store.dispatch(summaryActions.setTotalPolicyholders(200));
    });

    expect(await findByText('200')).toBeInTheDocument();
    expect(await findByText('Tomadores')).toBeInTheDocument();
  });

  it('Should render policyholder total card with error if store flag is set to true', async () => {
    await act(async () => {
      store.dispatch(
        policyholderFilterActions.setErrorFetchPolicyholders(true),
      );
    });

    const { findByText } = render(
      <Provider store={store}>
        <DashboardSummary
          totalOpportunities={undefined}
          totalInsuredAmount={undefined}
          errorModalitySummary={false}
        />
      </Provider>,
    );

    expect(
      await findByText(
        'Ocorreu um erro inesperado ao carregar esta informação.',
      ),
    ).toBeTruthy();
  });

  it('Should render total opportunities card with values correctly', async () => {
    const { findByText } = render(
      <Provider store={store}>
        <DashboardSummary
          totalOpportunities={250}
          totalInsuredAmount={undefined}
          errorModalitySummary={false}
        />
      </Provider>,
    );

    expect(await findByText('250')).toBeInTheDocument();
    expect(await findByText('Total de oportunidades')).toBeInTheDocument();
  });

  it('Should render total insured amount card with values correctly', async () => {
    const { findByText } = render(
      <Provider store={store}>
        <DashboardSummary
          totalOpportunities={undefined}
          totalInsuredAmount={12392444.120000001}
          errorModalitySummary={false}
        />
      </Provider>,
    );

    expect(await findByText('R$ 12,39 milhões')).toBeInTheDocument();
    expect(
      await findByText('Em importância segurada (IS)'),
    ).toBeInTheDocument();
  });
});
