import '@testing-library/jest-dom';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import { fireEvent, render } from '../../../config/testUtils';
import ProcessListStatusFilter from './ProcessListStatusFilter';
import { getStatusFilterOptionsMock } from '../../../__mocks__';

describe('ProcessListStatusFilter', () => {
  it('Should fetch status option list on mount', async () => {
    jest
      .spyOn(ProcessListingApi, 'getStatusFilterOptions')
      .mockImplementationOnce(async () => getStatusFilterOptionsMock);

    const { findByTestId, findByText } = render(
      <ProcessListStatusFilter
        showClearButton={false}
        changeStatusValueCallback={jest.fn()}
      />,
    );

    expect((await findByTestId('dropdown-input-list')).children.length).toBe(9);
    expect(await findByText('Todos')).toBeInTheDocument();
    expect(await findByText('Vigente')).toBeInTheDocument();
    expect(await findByText('A vencer')).toBeInTheDocument();
    expect(await findByText('Vencida')).toBeInTheDocument();
    expect(await findByText('Cancelada')).toBeInTheDocument();
    expect(await findByText('Recusada')).toBeInTheDocument();
    expect(await findByText('Em análise')).toBeInTheDocument();
    expect(await findByText('Aguardando aprovação')).toBeInTheDocument();
  });

  it('Should call changeStatusValueCallback with status id on option select', async () => {
    jest
      .spyOn(ProcessListingApi, 'getStatusFilterOptions')
      .mockImplementationOnce(async () => getStatusFilterOptionsMock);
    const callbackMock = jest.fn();

    const { findByTestId } = render(
      <ProcessListStatusFilter
        showClearButton={false}
        changeStatusValueCallback={callbackMock}
      />,
    );
    fireEvent.click((await findByTestId('dropdown-input-list')).children[1]);
    expect(callbackMock).toHaveBeenCalledWith(5);
  });

  it('Should call changeStatusValueCallback with -1 value when clear button is clicked', async () => {
    jest
      .spyOn(ProcessListingApi, 'getStatusFilterOptions')
      .mockImplementationOnce(async () => getStatusFilterOptionsMock);
    const callbackMock = jest.fn();

    const { findByTestId } = render(
      <ProcessListStatusFilter
        showClearButton
        changeStatusValueCallback={callbackMock}
      />,
    );
    fireEvent.click(await findByTestId('processListStatusFilter-btn-clear'));
    expect(callbackMock).toHaveBeenCalledWith(-1);
  });
});
