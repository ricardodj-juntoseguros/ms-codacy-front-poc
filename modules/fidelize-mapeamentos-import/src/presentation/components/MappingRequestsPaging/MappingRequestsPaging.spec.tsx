import MappingRequestsPaging from './MappingRequestsPaging';
import { render, fireEvent, act } from '../../../config/testUtils';
import { MappingStatusEnum } from '../../../application/types/model';
import { store } from '../../../config/store';

describe('MappingRequestsPaging', () => {
  it('Should update store on pagination change', async () => {
    const { getByTestId } = render(
      <MappingRequestsPaging
        mappingStatus={MappingStatusEnum.ON_QUEUE}
        totalRequests={100}
      />,
    );
    await act(async () => {
      fireEvent.click(getByTestId('pagination-next-btn'));
    });
    const storeSettings = store
      .getState()
      .mappingRequestsList.settings.find(
        setting => setting.mappingStatus === MappingStatusEnum.ON_QUEUE,
      );
    expect(storeSettings).toBeDefined();
    expect(storeSettings?.activePage).toBe(2);
  });

  it('Should update store on page size selector change', async () => {
    const { getByTestId } = render(
      <MappingRequestsPaging
        mappingStatus={MappingStatusEnum.ON_QUEUE}
        totalRequests={100}
      />,
    );
    const optionToSelect = getByTestId('dropdown-input-list').children[1];
    await act(async () => {
      fireEvent.click(optionToSelect);
    });
    const storeSettings = store
      .getState()
      .mappingRequestsList.settings.find(
        setting => setting.mappingStatus === MappingStatusEnum.ON_QUEUE,
      );
    expect(storeSettings).toBeDefined();
    expect(storeSettings?.pageSize).toBe(25);
  });
});
