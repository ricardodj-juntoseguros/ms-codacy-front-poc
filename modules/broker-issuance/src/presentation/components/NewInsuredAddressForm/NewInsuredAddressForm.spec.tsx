/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import InsuredSelectionApi from '../../../application/features/insuredSelection/InsuredSelectionApi';
import {
  insuredMock,
  newInsuredAddressMock,
  searchAddressMock,
} from '../../../__mocks__';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import NewInsuredAddressForm from './NewInsuredAddressForm';
import { store } from '../../../config/store';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import { URL_CORREIOS_BUSCACEP } from '../../../constants';

describe('NewInsuredAddressForm', () => {
  const windowOpen = jest.fn();
  window.open = windowOpen;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should search a address by zipcode filled input', async () => {
    const searchMock = jest
      .spyOn(InsuredSelectionApi, 'getAddressByZipcode')
      .mockImplementation(async () => searchAddressMock);
    const { getByTestId } = render(
      <NewInsuredAddressForm closeModalCallback={jest.fn()} />,
    );
    const input = getByTestId('newInsuredAddressForm-zipcode-input');
    fireEvent.change(input, { target: { value: '80410201' } });
    fireEvent.blur(input);
    expect(searchMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(getByTestId('newInsuredAddressForm-city-input')).toHaveValue(
        'Curitiba',
      );
      expect(getByTestId('newInsuredAddressForm-uf-input')).toHaveValue('PR');
      expect(getByTestId('newInsuredAddressForm-street-input')).toHaveValue(
        'Rua Visconde de Nacar - Centro',
      );
    });
  });

  it('Should display an error alert if address zipcode search fails', async () => {
    const searchMock = jest
      .spyOn(InsuredSelectionApi, 'getAddressByZipcode')
      .mockImplementation(async () =>
        Promise.reject({ data: { error: 'Not Found' }, status: 404 }),
      );
    const { getByTestId, findByText } = render(
      <NewInsuredAddressForm closeModalCallback={jest.fn()} />,
    );
    const input = getByTestId('newInsuredAddressForm-zipcode-input');
    fireEvent.change(input, { target: { value: '88888888' } });
    fireEvent.blur(input);
    expect(searchMock).toHaveBeenCalled();
    expect(
      await findByText(
        'Não conseguimos localizar o endereço através do CEP inserido. Por favor, preencha os campos a seguir com os demais dados.',
      ),
    ).toBeInTheDocument();
  });

  it('Should be able to fill the form and save a new address to the insured', async () => {
    store.dispatch(proposalActions.setInsured(insuredMock));
    jest
      .spyOn(InsuredSelectionApi, 'getAddressByZipcode')
      .mockImplementation(async () => searchAddressMock);
    const mockPost = jest
      .spyOn(InsuredSelectionApi, 'saveInsuredAddress')
      .mockImplementation(async () => newInsuredAddressMock);
    const { getByTestId } = render(
      <NewInsuredAddressForm closeModalCallback={jest.fn()} />,
    );
    const zipCodeinput = getByTestId('newInsuredAddressForm-zipcode-input');
    fireEvent.change(zipCodeinput, { target: { value: '80410201' } });
    fireEvent.blur(zipCodeinput);
    await waitFor(() => {
      expect(getByTestId('newInsuredAddressForm-city-input')).toHaveValue(
        'Curitiba',
      );
      expect(getByTestId('newInsuredAddressForm-uf-input')).toHaveValue('PR');
      expect(getByTestId('newInsuredAddressForm-street-input')).toHaveValue(
        'Rua Visconde de Nacar - Centro',
      );
    });
    const numberInput = getByTestId('newInsuredAddressForm-number-input');
    fireEvent.change(numberInput, { target: { value: '123' } });
    const complementInput = getByTestId(
      'newInsuredAddressForm-complement-input',
    );
    fireEvent.change(complementInput, { target: { value: 'Casa 2' } });
    const submit = getByTestId('newInsuredAddressForm-submit-button');
    fireEvent.click(submit);
    expect(mockPost).toHaveBeenLastCalledWith(
      6455,
      'Curitiba',
      'PR',
      'Rua Visconde de Nacar - Centro, N.º 123, Casa 2',
    );
    await waitFor(() => {
      expect(store.getState().proposal.insuredAddress?.addressId).toBe(
        newInsuredAddressMock.id,
      );
      expect(
        store.getState().insuredSelection.insuredAddressesOptions.length,
      ).toBe(1);
    });
  });

  it('Should be able to open correios search', async () => {
    const { getByTestId } = render(
      <NewInsuredAddressForm closeModalCallback={jest.fn()} />,
    );
    const button = getByTestId('newInsuredAddressForm-correios-linkbutton');
    fireEvent.click(button);
    expect(windowOpen).toHaveBeenCalledWith(URL_CORREIOS_BUSCACEP, '_blank');
  });

  it('Should be able to call callback on cancel button click', async () => {
    const mockCallback = jest.fn();
    const { getByTestId } = render(
      <NewInsuredAddressForm closeModalCallback={mockCallback} />,
    );
    const button = getByTestId('newInsuredAddressForm-cancel-button');
    fireEvent.click(button);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
