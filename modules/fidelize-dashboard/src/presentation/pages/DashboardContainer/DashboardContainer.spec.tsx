import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import {
  ModalitySummaryDTO,
  PolicyholderDTO,
} from 'modules/fidelize-dashboard/src/application/types/dto';
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
      .spyOn(SummaryApi, 'getPolicyholdersTotal')
      .mockImplementation(async () => {
        return {
          totalPolicyholders: 123,
        };
      });
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
  });

  it('Should call SummaryApi to fetch modalities summary', async () => {
    const apiMock = jest
      .spyOn(SummaryApi, 'getModalitiesSummary')
      .mockImplementation(async () => {
        return [
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
        ] as ModalitySummaryDTO[];
      });
    await store.dispatch(fetchAccessToFeature('TRABALHISTA'));

    const { findByText, findAllByText, findByTestId } = render(
      <Provider store={store}>
        <DashboardContainer />
      </Provider>,
    );

    expect(await findByText('Op. fiscais')).toBeTruthy();
    expect((await findAllByText('100')).length).toBe(2);
    expect(await findByText('R$ 1 milhões')).toBeTruthy();

    const tabTrabalhista = await findByTestId('tab-labor');
    await act(async () => {
      fireEvent.click(tabTrabalhista);
    });
    expect(await findByText('Op. trabalhistas')).toBeTruthy();
    expect((await findAllByText('350')).length).toBe(2);
    expect(await findByText('R$ 2,55 milhões')).toBeTruthy();

    expect(apiMock).toHaveBeenCalledTimes(1);
  });
});
