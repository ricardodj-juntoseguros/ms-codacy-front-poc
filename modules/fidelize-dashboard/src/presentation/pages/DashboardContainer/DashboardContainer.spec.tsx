import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import {
  ModalitySummaryDTO,
  PolicyholderDTO,
  SummaryChartDataDTO,
  ModalitiesSummaryDTO,
} from 'modules/fidelize-dashboard/src/application/types/dto';

import SummaryChartsApi from '../../../application/features/summaryCharts/SummaryChartsApi';
import AccessCheckApi from '../../../application/features/accessCheck/AccessCheckApi';
import PolicyholderFilterApi from '../../../application/features/policyholderFilter/PolicyholderFilterApi';
import { store } from '../../../config/store';
import SummaryApi from '../../../application/features/summary/SummaryApi';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import DashboardContainer from './DashboardContainer';
import { fetchAccessToFeature } from '../../../application/features/accessCheck/AccessCheckSlice';

describe('DashboardContainer', () => {
  beforeEach(() => {
    jest
      .spyOn(OpportunitiesDetailsApi, 'getOpportunitiesDetailsByModality')
      .mockImplementation(async () => {
        return {
          totalCount: 123,
          data: [],
        };
      });
    jest
      .spyOn(AccessCheckApi, 'checkAccessToFeature')
      .mockImplementation(async () => {
        return true;
      });
    jest
      .spyOn(PolicyholderFilterApi, 'getMappedPolicyholderList')
      .mockImplementation(async () => {
        return [] as PolicyholderDTO[];
      });
    jest
      .spyOn(SummaryChartsApi, 'getChartData')
      .mockImplementation(async () => {
        return {
          series: [],
          categories: [],
          tooltip: { labels: [] },
        } as SummaryChartDataDTO;
      });
  });

  it('Should call SummaryApi to fetch modalities summary', async () => {
    const apiMock = jest
      .spyOn(SummaryApi, 'getModalitiesSummary')
      .mockImplementation(async () => {
        return {
          totalOpportunities: 450,
          totalInsuredAmount: 3550000,
          totalsModalities: [
            {
              modality: 'fiscal',
              totalOpportunities: 100,
              totalInsuredAmount: 1000000,
            },
            {
              modality: 'labor',
              totalOpportunities: 350,
              totalInsuredAmount: 2550000,
            },
          ],
        } as ModalitiesSummaryDTO;
      });
    await store.dispatch(fetchAccessToFeature('TRABALHISTA'));

    const { findByText, findAllByText, findByTestId } = render(
      <Provider store={store}>
        <DashboardContainer />
      </Provider>,
    );

    expect(await findByText('Op. trabalhistas')).toBeTruthy();
    expect((await findAllByText('350')).length).toBe(2);
    expect(await findByText('R$ 2,55 milhões')).toBeTruthy();

    const tabFiscal = await findByTestId('tab-fiscal');
    await act(async () => {
      fireEvent.click(tabFiscal);
    });
    expect(await findByText('Op. fiscais')).toBeTruthy();
    expect((await findAllByText('100')).length).toBe(2);
    expect(await findByText('R$ 1 milhões')).toBeTruthy();

    expect(apiMock).toHaveBeenCalledTimes(1);
  });
});
