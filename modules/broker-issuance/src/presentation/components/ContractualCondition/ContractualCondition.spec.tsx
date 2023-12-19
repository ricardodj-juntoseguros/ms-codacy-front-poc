import { act, fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import ContractualCondition from './ContractualCondition';
import ContractualConditionApi from '../../../application/features/contractualCondition/ContractualConditionApi';
import { customClauseMock } from '../../../__mocks__';
import { getCustomClause } from '../../../application/features/contractualCondition/ContractualConditionSlice';

describe('ContractualCondition', () => {
  it('should be able to insert data for a customized clause', async () => {
    const { getByTestId, findByTestId } = render(<ContractualCondition />);
    const contractualConditionToggle = getByTestId(
      'contractualConditions-toggle-show',
    );
    await act(async () => {
      await fireEvent.click(contractualConditionToggle);
    });
    const policyholderRadioButton = await findByTestId(
      'contractualConditions-policyholder-radio-button',
    );
    const textAreaInput = await findByTestId('contractualConditions-text-area');
    fireEvent.click(policyholderRadioButton);
    fireEvent.change(textAreaInput, { target: { value: 'Teste' } });
    const state = store.getState();
    expect(state.contractualCondition.requestedBy).toBe(1);
    expect(state.contractualCondition.text).toBe('Teste');
  });

  it('should be able to delete a custom clause if the user changes the toggle to false', async () => {
    jest
      .spyOn(ContractualConditionApi, 'getCustomClause')
      .mockImplementation(() => Promise.resolve(customClauseMock));
    const patchCustomClauseMock = jest
      .spyOn(ContractualConditionApi, 'patchCustomClause')
      .mockImplementation(() => Promise.resolve());
    await store.dispatch(getCustomClause(12345));
    const { getByTestId } = render(<ContractualCondition />);
    const contractualConditionToggle = getByTestId(
      'contractualConditions-toggle-show',
    );
    await act(async () => {
      await fireEvent.click(contractualConditionToggle);
    });
    await act(async () => {
      await fireEvent.click(contractualConditionToggle);
    });
    const { contractualCondition } = store.getState();
    expect(patchCustomClauseMock).toHaveBeenCalledWith(1341, true, 1, 'teste1');
    expect(contractualCondition.currentContractualCondition).toEqual(null);
    expect(contractualCondition.requestedBy).toEqual(null);
    expect(contractualCondition.text).toEqual('');
  });
});
