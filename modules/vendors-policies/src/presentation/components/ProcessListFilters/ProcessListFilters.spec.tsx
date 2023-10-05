import '@testing-library/jest-dom';
import { UserTypeEnum } from '@services';
import { fireEvent, render } from '../../../config/testUtils';
import ProcessListFilters from './ProcessListFilters';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import {
  getInsuredsForInsuredUserMock,
  getStatusFilterOptionsMock,
} from '../../../__mocks__';

describe('ProcessListFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(ProcessListingApi, 'getStatusFilterOptions')
      .mockImplementationOnce(async () => getStatusFilterOptionsMock);
  });

  it('Should render process filter by default', async () => {
    const { findByTestId } = render(
      <ProcessListFilters
        isLoadingProcesses={false}
        currentFilters={{}}
        onChangeFilterValueCallback={jest.fn()}
        onChangeFilterTypeCallback={jest.fn()}
        userType={UserTypeEnum.INSURED}
      />,
    );
    expect(
      await findByTestId('processListProcessFilter-input'),
    ).toBeInTheDocument();
  });

  it('Should call onChangeFilterCallback with selected filter and null value when option change', async () => {
    const mockCallback = jest.fn();
    const { findByTestId } = render(
      <ProcessListFilters
        isLoadingProcesses={false}
        currentFilters={{}}
        onChangeFilterValueCallback={mockCallback}
        onChangeFilterTypeCallback={mockCallback}
        userType={UserTypeEnum.INSURED}
      />,
    );
    fireEvent.click((await findByTestId('dropdown-input-list')).children[1]);
    expect(mockCallback).toHaveBeenCalled();
  });

  it('Should render status filter when selected', async () => {
    const { findByTestId } = render(
      <ProcessListFilters
        isLoadingProcesses={false}
        currentFilters={{}}
        onChangeFilterValueCallback={jest.fn()}
        onChangeFilterTypeCallback={jest.fn()}
        userType={UserTypeEnum.INSURED}
      />,
    );
    fireEvent.click((await findByTestId('dropdown-input-list')).children[1]);
    expect(
      await findByTestId('processListStatusFilter-dropdown'),
    ).toBeInTheDocument();
  });

  it('Should render insured filter when selected', async () => {
    jest
      .spyOn(ProcessListingApi, 'getInsuredOptionsForInsuredUser')
      .mockImplementation(async () => {
        return getInsuredsForInsuredUserMock;
      });
    const { findByTestId } = render(
      <ProcessListFilters
        isLoadingProcesses={false}
        currentFilters={{}}
        onChangeFilterValueCallback={jest.fn()}
        onChangeFilterTypeCallback={jest.fn()}
        userType={UserTypeEnum.INSURED}
      />,
    );
    fireEvent.click((await findByTestId('dropdown-input-list')).children[3]);
    expect(
      await findByTestId('processListInsuredFilter-input-search'),
    ).toBeInTheDocument();
  });

  it('Should render policyholder filter when selected', async () => {
    const { findByTestId } = render(
      <ProcessListFilters
        isLoadingProcesses={false}
        currentFilters={{}}
        onChangeFilterValueCallback={jest.fn()}
        onChangeFilterTypeCallback={jest.fn()}
        userType={UserTypeEnum.INSURED}
      />,
    );
    fireEvent.click((await findByTestId('dropdown-input-list')).children[2]);
    expect(
      await findByTestId('processListPolicyholderFilter-input-search'),
    ).toBeInTheDocument();
  });
});
