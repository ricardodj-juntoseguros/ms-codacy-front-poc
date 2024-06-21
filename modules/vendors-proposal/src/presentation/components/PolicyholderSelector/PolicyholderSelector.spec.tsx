import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import PolicyholderSelector from './PolicyholderSelector';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';
import {
  policyholderAffiliatesMock,
  policyholdersMock,
} from '../../../__mocks__';
import { store } from '../../../config/store';

describe('PolicyholderSelector', () => {
  jest.useFakeTimers();

  it('should not dispatch searchPolicyholders thunk if inputted search value is less than 3 chars length', async () => {
    jest.spyOn(InsuredAndPolicyholderSelectionApi, 'getPolicyholders');
    const { getByTestId } = render(<PolicyholderSelector />);
    const input = getByTestId('policyholderSelector-search-input');
    fireEvent.change(input, { target: { value: 'te' } });
    jest.runAllTimers();
    expect(
      InsuredAndPolicyholderSelectionApi.getPolicyholders,
    ).toHaveBeenCalledTimes(0);
  });

  it('Should search policyholders, set store values and dispatch getPolicyholderAffiliates on policyholder option select', async () => {
    const policyholderApiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getPolicyholders')
      .mockImplementation(async () => {
        return policyholdersMock;
      });
    const policyholderAffiliateApiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getPolicyholderAffiliates')
      .mockImplementation(async () => {
        return policyholderAffiliatesMock;
      });
    const { getByTestId, findByText } = render(<PolicyholderSelector />);
    fireEvent.change(getByTestId('policyholderSelector-search-input'), {
      target: { value: 'Tomador' },
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(policyholderApiMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(
      async () => await findByText('TOMADOR 1 - 33.768.864/0001-07'),
    );
    fireEvent.click(getByTestId('search-input-list').children[0]);
    await waitFor(() => {
      const proposalState = store.getState().proposal;
      expect(proposalState.policyholder.externalId).toBe(1);
      expect(proposalState.policyholder.federalId).toBe('33768864000107');
      expect(proposalState.policyholder.corporateName).toBe('TOMADOR 1');
      expect(policyholderAffiliateApiMock).toHaveBeenCalledTimes(1);
    });
  });

  it('Should display correct message if there is no results on search and inputted value is not a federalId', async () => {
    const policyholderApiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getPolicyholders')
      .mockImplementation(async () => {
        return [];
      });
    const { getByTestId, findByText } = render(<PolicyholderSelector />);
    fireEvent.change(getByTestId('policyholderSelector-search-input'), {
      target: { value: 'Tomador' },
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(policyholderApiMock).toHaveBeenCalled();
    });
    await waitFor(async () => {
      expect(
        await findByText(
          'Sem registro. Digite o CNPJ para cadastrar o fornecedor.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('Should display correct message if there is no results on search and inputted value is a valid federalId', async () => {
    const policyholderApiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getPolicyholders')
      .mockImplementation(async () => {
        return [];
      });
    const { getByTestId, findByText } = render(<PolicyholderSelector />);
    fireEvent.change(getByTestId('policyholderSelector-search-input'), {
      target: { value: '59493268000155' },
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(policyholderApiMock).toHaveBeenCalled();
    });
    await waitFor(async () => {
      expect(
        await findByText('CNPJ válido. O fornecedor será cadastrado.'),
      ).toBeInTheDocument();
    });
  });

  it('Should display correct message if there is no results on search and inputted value is a invalid federalId', async () => {
    const policyholderApiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getPolicyholders')
      .mockImplementation(async () => {
        return [];
      });
    const { getByTestId, findAllByText } = render(<PolicyholderSelector />);
    fireEvent.change(getByTestId('policyholderSelector-search-input'), {
      target: { value: '11223344556677' },
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(policyholderApiMock).toHaveBeenCalled();
    });
    await waitFor(async () => {
      expect(
        (await findAllByText('Ops, parece que esse CNPJ não existe.'))[0],
      ).toBeInTheDocument();
    });
  });
});
