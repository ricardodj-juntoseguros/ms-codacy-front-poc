import '@testing-library/jest-dom';
import { VendorsAuthService, UserTypeEnum } from '@services';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import {
  proposalListMock,
  proposalListFullPageMock,
  getStatusFilterOptionsMock,
  searchPolicyholderOptionsMock,
  getInsuredOptionsMock,
} from '../../../__mocks__';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import ProcessList from './ProcessList';

describe('ProcessList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.INSURED);
  });

  it('Should call bff api to fetch processes on component mount', async () => {
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementationOnce(async () => {
        return proposalListMock;
      });

    const { findByText } = render(<ProcessList />);
    await findByText('3 processos listados.');
    expect(ProcessListingApi.getProcesses).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });

  it('Should call bff api to fetch processes on pagination change', async () => {
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementation(async () => {
        return proposalListFullPageMock;
      });

    const { findByText, getByTestId } = render(<ProcessList />);
    await findByText('20 processos listados.');
    expect(ProcessListingApi.getProcesses).toHaveBeenLastCalledWith(
      1,
      10,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    fireEvent.click(getByTestId('pagination-page-2-btn'));
    await findByText('20 processos listados.');
    expect(ProcessListingApi.getProcesses).toHaveBeenCalledWith(
      2,
      10,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });

  it('Should render correct feedback if api call return no records', async () => {
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementationOnce(async () => {
        return {
          currentPage: 1,
          totalCount: 0,
          data: [],
          hasMore: false,
        };
      });

    const { findByText, getByText } = render(<ProcessList />);
    await findByText('0 processos listados.');
    expect(getByText('Você ainda não possui processos')).toBeInTheDocument();
  });

  it('Should render correct feedback if api call fails', async () => {
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementationOnce(async () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          data: {},
        });
      });

    const { findByText, getByText } = render(<ProcessList />);
    await findByText('0 processos listados.');
    expect(getByText('Lista indisponível')).toBeInTheDocument();
  });

  it('Should call bff api to fetch processes with process filter filled', async () => {
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementation(async () => {
        return proposalListFullPageMock;
      });

    const { getByTestId } = render(<ProcessList />);
    const processFilterInput = getByTestId('processListProcessFilter-input');
    fireEvent.change(processFilterInput, { target: { value: '303123' } });
    fireEvent.keyDown(processFilterInput, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    });
    expect(ProcessListingApi.getProcesses).toHaveBeenLastCalledWith(
      1,
      10,
      '303123',
      undefined,
      undefined,
      undefined,
    );
  });

  it('Should call bff api to fetch processes with status filter selected', async () => {
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementation(async () => {
        return proposalListFullPageMock;
      });
    jest
      .spyOn(ProcessListingApi, 'getStatusFilterOptions')
      .mockImplementation(async () => {
        return getStatusFilterOptionsMock;
      });

    const { getByTestId, findByText } = render(<ProcessList />);
    fireEvent.click(getByTestId('dropdown-input-list').children[1]);
    fireEvent.click(await findByText('Vigente'));
    expect(ProcessListingApi.getProcesses).toHaveBeenLastCalledWith(
      1,
      10,
      undefined,
      5,
      undefined,
      undefined,
    );
  });

  it('Should call bff api to fetch processes with policyholder filter selected', async () => {
    jest.useFakeTimers();
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementation(async () => {
        return proposalListFullPageMock;
      });
    jest
      .spyOn(ProcessListingApi, 'searchPolicyholderOptions')
      .mockImplementation(async () => {
        return searchPolicyholderOptionsMock;
      });

    const { getByTestId, findByTestId, findByText } = render(<ProcessList />);
    fireEvent.click(getByTestId('dropdown-input-list').children[2]);
    const policyholderFilterInput = await findByTestId(
      'processListPolicyholderFilter-input-search',
    );
    fireEvent.change(policyholderFilterInput, {
      target: { value: 'TOMADOR' },
    });
    jest.runAllTimers();
    await waitFor(async () => {
      expect(ProcessListingApi.searchPolicyholderOptions).toHaveBeenCalled();
    });
    fireEvent.click(await findByText('TOMADOR 1'));
    expect(ProcessListingApi.getProcesses).toHaveBeenLastCalledWith(
      1,
      10,
      undefined,
      undefined,
      undefined,
      '33768864000107',
    );
  });

  it('Should call bff api to fetch processes with insured filter selected', async () => {
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementation(async () => {
        return proposalListFullPageMock;
      });
    jest
      .spyOn(ProcessListingApi, 'getInsuredOptions')
      .mockImplementation(async () => {
        return getInsuredOptionsMock;
      });

    const { getByTestId, findByTestId, findByText } = render(<ProcessList />);
    fireEvent.click(getByTestId('dropdown-input-list').children[3]);
    const insuredFilterInput = await findByTestId(
      'processListInsuredFilter-input-search',
    );
    fireEvent.change(insuredFilterInput, {
      target: { value: 'Segurado 1' },
    });
    await waitFor(async () => {
      expect(ProcessListingApi.getInsuredOptions).toHaveBeenCalled();
    });
    fireEvent.click(await findByText('Teste Segurado 1'));
    expect(ProcessListingApi.getProcesses).toHaveBeenLastCalledWith(
      1,
      10,
      undefined,
      undefined,
      '51715480000108',
      undefined,
    );
  });
});
