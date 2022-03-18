import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ModalitySummaryDTO } from 'modules/fidelize-dashboard/src/application/types/dto';
import { store } from '../../../config/store';
import SummaryApi from '../../../application/features/summary/SummaryApi';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import DashboardContainer from './DashboardContainer';

describe('DashboardContainer', () => {
  beforeAll(() => {
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
        ] as ModalitySummaryDTO[];
      });

    const { findByText, findAllByText } = render(
      <Provider store={store}>
        <DashboardContainer />
      </Provider>,
    );

    expect(await findByText('Op. fiscais')).toBeTruthy();
    expect((await findAllByText('100')).length).toBe(2);
    expect(await findByText('R$ 1 milhões')).toBeTruthy();
    expect(apiMock).toHaveBeenCalledTimes(1);
  });
});
