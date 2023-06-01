import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';
import { insuredListMock } from '../../../__mocks__';
import InsuredSelector from './InsuredSelector';
import { store } from '../../../config/store';

describe('InsuredSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should fetch insured list on mount and display readonly text input if only one is returned', async () => {
    const apiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi.prototype, 'getInsuredList')
      .mockImplementationOnce(async () => insuredListMock.slice(0, 1));
    const { findByTestId } = render(
      <InsuredSelector onLoadedInsureds={jest.fn()} />,
    );
    expect(
      await findByTestId('insuredSelector-input-readonly'),
    ).toBeInTheDocument();
    expect(await findByTestId('insuredSelector-input-readonly')).toHaveValue(
      'Teste Segurado 1 - 51.715.480/0001-08',
    );
    expect(apiMock).toHaveBeenCalledTimes(1);
  });

  it('Should fetch insured list on mount and display dropdown if more than one is returned', async () => {
    const apiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi.prototype, 'getInsuredList')
      .mockImplementationOnce(async () => insuredListMock);
    const { findByTestId } = render(
      <InsuredSelector onLoadedInsureds={jest.fn()} />,
    );
    expect(
      await findByTestId('insuredSelector-input-dropdown'),
    ).toBeInTheDocument();
    expect(apiMock).toHaveBeenCalledTimes(1);
  });

  it('Should send selected insured  data to store on dropdown selection', async () => {
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi.prototype, 'getInsuredList')
      .mockImplementationOnce(async () => insuredListMock);
    const { findByTestId, getByTestId, findByText } = render(
      <InsuredSelector onLoadedInsureds={jest.fn()} />,
    );
    expect(
      await findByTestId('insuredSelector-input-dropdown'),
    ).toBeInTheDocument();
    fireEvent.click(getByTestId('dropdown-input-list').children[0]);
    expect(
      await findByText('Teste Segurado 1 - 51.715.480/0001-08'),
    ).toBeInTheDocument();
    expect(store.getState().proposal.insuredFederalId).toBe('51715480000108');
    expect(store.getState().proposal.insuredName).toBe('Teste Segurado 1');
  });
});
