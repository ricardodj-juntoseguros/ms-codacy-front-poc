import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import SummaryApi from '../../../application/features/summary/SummaryApi';
import DashboardSummary from '.';

describe('DashboardSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should call SummaryApi to fetch total policyholders', async () => {
    const apiMock = jest
      .spyOn(SummaryApi, 'getPolicyholdersTotal')
      .mockImplementation(async () => {
        return { totalPolicyholders: 150 };
      });

    const { findByText } = render(
      <Provider store={store}>
        <DashboardSummary />
      </Provider>,
    );

    expect(await findByText('150')).toBeTruthy();
    expect(await findByText('Tomadores')).toBeTruthy();
    expect(apiMock).toHaveBeenCalledTimes(1);
  });

  it('Should render card with error if SummaryApi fetch failed', async () => {
    jest
      .spyOn(SummaryApi, 'getPolicyholdersTotal')
      .mockImplementation(async () => {
        throw new Error();
      });

    const { findByText } = render(
      <Provider store={store}>
        <DashboardSummary />
      </Provider>,
    );

    expect(
      await findByText(
        'Ocorreu um erro inesperado ao carregar esta informação.',
      ),
    ).toBeTruthy();
  });
});
