import '@testing-library/jest-dom';
import { insuredAddressesMock } from 'modules/vendors-proposal/src/__mocks__';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import { store } from '../../../config/store';
import { fireEvent, render } from '../../../config/testUtils';
import InsuredAddressSelector from './InsuredAddressSelector';

describe('InsuredAddressSelector', () => {
  it('Should render disable input when there is no address data and no address selected', async () => {
    await store.dispatch(proposalActions.setInsuredAddressId(0));
    const { getByTestId } = render(<InsuredAddressSelector />);
    expect(
      getByTestId('insuredAdressSelector-input-disabled'),
    ).toBeInTheDocument();
  });

  it('With insured selected, should render loading, fetch addresses and display dropdown if there is more than one address', async () => {
    await store.dispatch(
      proposalActions.setInsuredValues({
        federalId: '11223344556677',
        name: 'Segurado',
      }),
    );
    const apiMock = jest
      .spyOn(
        InsuredAndPolicyholderSelectionApi.prototype,
        'getInsuredAddresses',
      )
      .mockImplementationOnce(async () => insuredAddressesMock);
    const { getByTestId, findByTestId } = render(<InsuredAddressSelector />);
    expect(
      getByTestId('insuredAdressSelector-input-loading'),
    ).toBeInTheDocument();
    expect(apiMock).toHaveBeenCalledWith('11223344556677');
    expect(
      await findByTestId('insuredAddressSelector-input-dropdown'),
    ).toBeInTheDocument();
  });

  it('With insured selected, should render loading, fetch addresses and display readonly input if there is only one address', async () => {
    await store.dispatch(
      proposalActions.setInsuredValues({
        federalId: '11223344556677',
        name: 'Segurado',
      }),
    );
    const apiMock = jest
      .spyOn(
        InsuredAndPolicyholderSelectionApi.prototype,
        'getInsuredAddresses',
      )
      .mockImplementationOnce(async () => insuredAddressesMock.slice(0, 1));
    const { getByTestId, findByTestId, findByDisplayValue } = render(
      <InsuredAddressSelector />,
    );
    expect(
      getByTestId('insuredAdressSelector-input-loading'),
    ).toBeInTheDocument();
    expect(apiMock).toHaveBeenCalledWith('11223344556677');
    expect(
      await findByTestId('insuredAddressSelector-input-readonly'),
    ).toBeInTheDocument();
    expect(
      await findByDisplayValue('Rua XV de Novembro, 1 - CURITIBA/PR'),
    ).toBeInTheDocument();
  });

  it('Should change store value with selected address on dropdown', async () => {
    await store.dispatch(
      proposalActions.setInsuredValues({
        federalId: '11223344556677',
        name: 'Segurado',
      }),
    );
    jest
      .spyOn(
        InsuredAndPolicyholderSelectionApi.prototype,
        'getInsuredAddresses',
      )
      .mockImplementationOnce(async () => insuredAddressesMock);
    const { getByTestId, findByTestId, findByDisplayValue } = render(
      <InsuredAddressSelector />,
    );
    expect(
      await findByTestId('insuredAddressSelector-input-dropdown'),
    ).toBeInTheDocument();

    fireEvent.click(getByTestId('dropdown-input-list').children[0]);
    expect(
      await findByDisplayValue('Rua XV de Novembro, 1 - CURITIBA/PR'),
    ).toBeInTheDocument();
    expect(store.getState().proposal.insuredAddressId).toBe(1);
  });
});
