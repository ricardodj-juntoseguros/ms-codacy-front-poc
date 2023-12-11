import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { insuredMock } from '../../../__mocks__';
import InsuredSelectionApi from '../../../application/features/insuredSelection/InsuredSelectionApi';
import { InsuredSearchDTO } from '../../../application/types/dto';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import InsuredSelection from './InsuredSelection';
import { store } from '../../../config/store';

describe('InsuredSelection', () => {
  jest.useFakeTimers();
  let insuredSearchMock: jest.SpyInstance;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    insuredSearchMock = jest
      .spyOn(InsuredSelectionApi, 'searchInsured')
      .mockImplementation(() =>
        Promise.resolve({
          hasMore: false,
          records: [insuredMock],
        } as InsuredSearchDTO),
      );
  });

  it('should ble able not dispatch search Policyholders thunk if inputted search value is less than 3 chars length', async () => {
    const { getByTestId } = render(<InsuredSelection />);
    const input = getByTestId('insuredSelection-search-input');
    fireEvent.change(input, { target: { value: 'ab' } });
    jest.runAllTimers();
    await waitFor(() => expect(insuredSearchMock).not.toHaveBeenCalled());
  });

  it('should be able search insureds and set store values ​​on insured option select', async () => {
    const { getByTestId, findByText } = render(<InsuredSelection />);
    fireEvent.change(getByTestId('insuredSelection-search-input'), {
      target: { value: 'prefeitura' },
    });
    jest.runAllTimers();
    await waitFor(() =>
      expect(InsuredSelectionApi.searchInsured).toHaveBeenCalledWith(
        'prefeitura',
      ),
    );
    const option = await findByText(
      'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
    );
    await act(async () => {
      fireEvent.click(option);
    });
    await waitFor(() =>
      expect(getByTestId('insuredSelection-search-input')).toHaveValue(
        'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
      ),
    );
    const state = store.getState();
    expect(state.proposal.insured).toEqual({
      ...insuredMock,
      value: insuredMock.insuredId.toString(),
      label: insuredMock.name,
    });
  });

  it('should be able to select an address and set in the store', async () => {
    const { getByTestId, findByText } = render(<InsuredSelection />);
    fireEvent.change(getByTestId('insuredSelection-search-input'), {
      target: { value: 'prefeitura' },
    });
    jest.runAllTimers();
    await waitFor(() =>
      expect(InsuredSelectionApi.searchInsured).toHaveBeenCalledWith(
        'prefeitura',
      ),
    );
    const option = await findByText(
      'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
    );
    await act(async () => {
      fireEvent.click(option);
    });
    await waitFor(() =>
      expect(getByTestId('insuredSelection-search-input')).toHaveValue(
        'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
      ),
    );
    const addressOption = await findByText(
      'RUA SAO CLEMENTE 360 - RIO DE JANEIRO, RJ',
    );
    await act(async () => {
      fireEvent.click(addressOption);
    });
    const state = store.getState();
    expect(state.proposal.insuredAddress).toEqual({
      ...insuredMock.addresses[0],
      value: insuredMock.addresses[0].addressId.toString(),
      label: `${insuredMock.addresses[0].street} - ${insuredMock.addresses[0].city}, ${insuredMock.addresses[0].state}`,
    });
  });

  it('should be able to clear the options if the user sends empty text', async () => {
    const { getByTestId, findByText } = render(<InsuredSelection />);
    fireEvent.change(getByTestId('insuredSelection-search-input'), {
      target: { value: 'prefeitura' },
    });
    jest.runAllTimers();
    await waitFor(() =>
      expect(InsuredSelectionApi.searchInsured).toHaveBeenCalledWith(
        'prefeitura',
      ),
    );
    const option = await findByText(
      'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
    );
    await act(async () => {
      fireEvent.click(option);
    });
    let state = store.getState();
    expect(state.insuredSelection.insuredOptions.length).toEqual(1);
    fireEvent.change(getByTestId('insuredSelection-search-input'), {
      target: { value: '' },
    });
    jest.runAllTimers();
    state = store.getState();
    expect(state.insuredSelection.insuredOptions.length).toEqual(0);
  });

  it('should be able to insert the address automatically into the store if there is only one', async () => {
    insuredSearchMock = jest
      .spyOn(InsuredSelectionApi, 'searchInsured')
      .mockImplementation(() =>
        Promise.resolve({
          hasMore: false,
          records: [
            {
              ...insuredMock,
              addresses: [insuredMock.addresses[0]],
            },
          ],
        } as InsuredSearchDTO),
      );
    const { getByTestId, findByText } = render(<InsuredSelection />);
    fireEvent.change(getByTestId('insuredSelection-search-input'), {
      target: { value: 'prefeitura' },
    });
    jest.runAllTimers();
    await waitFor(() =>
      expect(InsuredSelectionApi.searchInsured).toHaveBeenCalledWith(
        'prefeitura',
      ),
    );
    const option = await findByText(
      'PREFEITURA DA CIDADE DO RIO DE JANEIRO - PROCURADORIA GERAL DO MUNICIPIO',
    );
    await act(async () => {
      fireEvent.click(option);
    });
    const state = store.getState();
    expect(state.proposal.insuredAddress).toEqual({
      ...insuredMock.addresses[0],
      value: insuredMock.addresses[0].addressId.toString(),
      label: `${insuredMock.addresses[0].street} - ${insuredMock.addresses[0].city}, ${insuredMock.addresses[0].state}`,
    });
  });
});
