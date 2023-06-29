import '@testing-library/jest-dom';
import { VendorsAuthService } from '@services';
import { fireEvent, render } from '../../../config/testUtils';
import { proposalListMock, proposalListFullPageMock } from '../../../__mocks__';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import ProcessList from './ProcessList';

describe('ProcessList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => 'insured');
  });

  it('Should call bff api to fetch processes on component mount', async () => {
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementationOnce(async () => {
        return proposalListMock;
      });

    const { findByText } = render(<ProcessList />);
    await findByText('3 processos listados');
    expect(ProcessListingApi.getProcesses).toHaveBeenCalledWith(1, 10);
  });

  it('Should call bff api to fetch processes on pagination change', async () => {
    jest
      .spyOn(ProcessListingApi, 'getProcesses')
      .mockImplementation(async () => {
        return proposalListFullPageMock;
      });

    const { findByText, getByTestId } = render(<ProcessList />);
    await findByText('20 processos listados');
    expect(ProcessListingApi.getProcesses).toHaveBeenLastCalledWith(1, 10);
    fireEvent.click(getByTestId('pagination-page-2-btn'));
    await findByText('20 processos listados');
    expect(ProcessListingApi.getProcesses).toHaveBeenCalledWith(2, 10);
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
    await findByText('0 processos listados');
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
    await findByText('0 processos listados');
    expect(getByText('Lista indisponível')).toBeInTheDocument();
  });
});
