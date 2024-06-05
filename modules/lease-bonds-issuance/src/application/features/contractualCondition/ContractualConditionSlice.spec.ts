/* eslint-disable prefer-promise-reject-errors */
import { customClauseMock } from "../../../__mocks__";
import { store } from "../../../config/store";
import ContractualConditionApi from "./ContractualConditionApi";
import { contractualConditionActions, getCustomClause, patchCustomClause, postCustomClause } from "./ContractualConditionSlice";

describe('ContractualConditionSlice', () => {

  beforeEach(() => {
    store.dispatch(contractualConditionActions.clearContractualConditions());
  });

  it('should be able to get custom contractual conditions', async () => {
    const getCustomClauseMock = jest
      .spyOn(ContractualConditionApi, 'getCustomClause')
      .mockImplementation(() => Promise.resolve(customClauseMock));
    await store.dispatch(getCustomClause(12345));
    const { contractualCondition } = store.getState();
    expect(getCustomClauseMock).toHaveBeenCalledWith(12345);
    expect(contractualCondition.currentContractualCondition).toEqual(customClauseMock[0]);
    expect(contractualCondition.requestedBy).toEqual(customClauseMock[0].requestedBy);
    expect(contractualCondition.text).toEqual(customClauseMock[0].text);
  });

  it('should be able to present an error if the call to get the custom clause fails', async () => {
    const getCustomClauseMock = jest
      .spyOn(ContractualConditionApi, 'getCustomClause')
      .mockImplementation(() => Promise.reject({ data: { message: 'erro ao buscar as condições.' } }));
    await store.dispatch(getCustomClause(12345));
    const { contractualCondition } = store.getState();
    expect(getCustomClauseMock).toHaveBeenCalledWith(12345);
    expect(contractualCondition.currentContractualCondition).toEqual(null);
    expect(contractualCondition.requestedBy).toEqual(null);
    expect(contractualCondition.text).toEqual('');
  });

  it('should be able to post custom contractual condition', async () => {
    const postCustomClauseMock = jest
      .spyOn(ContractualConditionApi, 'postCustomClause')
      .mockImplementation(() => Promise.resolve(customClauseMock[0]));
    await store.dispatch(postCustomClause({ policyId: 12345, requestedBy: 1, text: 'Teste' }));
    const { contractualCondition } = store.getState();
    expect(postCustomClauseMock).toHaveBeenCalledWith(12345, 1, 'Teste');
    expect(contractualCondition.currentContractualCondition).toEqual(customClauseMock[0]);
  });

  it('should be able to present an error if the call to post the custom clause fails', async () => {
    const postCustomClauseMock = jest
      .spyOn(ContractualConditionApi, 'postCustomClause')
      .mockImplementation(() => Promise.reject({ data: { message: 'erro ao inserir uma condição.' } }));
    await store.dispatch(postCustomClause({ policyId: 12345, requestedBy: 1, text: 'Teste' }));
    const { contractualCondition } = store.getState();
    expect(postCustomClauseMock).toHaveBeenCalledWith(12345, 1, 'Teste');
    expect(contractualCondition.currentContractualCondition).toEqual(null);
  });

  it('should be able to patch custom contractual condition', async () => {
    const patchCustomClauseMock = jest
      .spyOn(ContractualConditionApi, 'patchCustomClause')
      .mockImplementation(() => Promise.resolve());
    await store.dispatch(patchCustomClause({ clauseId: 12345, isDelete: true, requestedBy: 1, text: 'Teste' }));
    const { contractualCondition } = store.getState();
    expect(patchCustomClauseMock).toHaveBeenCalledWith(12345, true, 1, 'Teste');
    expect(contractualCondition.currentContractualCondition).toEqual(null);
    expect(contractualCondition.requestedBy).toEqual(null);
    expect(contractualCondition.text).toEqual('');
  });

  it('should be able to present an error if the call to patch the custom clause fails', async () => {
    const patchCustomClauseMock = jest
      .spyOn(ContractualConditionApi, 'patchCustomClause')
      .mockImplementation(() => Promise.reject({ data: { message: 'erro ao atualizar uma condição.' } }));
    store.dispatch(contractualConditionActions.setText(customClauseMock[0].text));
    store.dispatch(contractualConditionActions.setRequestedBy(customClauseMock[0].requestedBy.toString()));
    await store.dispatch(patchCustomClause({ clauseId: 12345, isDelete: true, requestedBy: 1, text: 'Teste' }));
    const { contractualCondition } = store.getState();
    expect(patchCustomClauseMock).toHaveBeenCalledWith(12345, true, 1, 'Teste');
    expect(contractualCondition.requestedBy).toEqual(customClauseMock[0].requestedBy);
    expect(contractualCondition.text).toEqual(customClauseMock[0].text);
  });

  it('should be able to set the text', () => {
    store.dispatch(contractualConditionActions.setText('Teste'));
    const { contractualCondition } = store.getState();
    expect(contractualCondition.text).toEqual('Teste');
  });

  it('should be able to set the requestedBy', () => {
    store.dispatch(contractualConditionActions.setRequestedBy('1'));
    const { contractualCondition } = store.getState();
    expect(contractualCondition.requestedBy).toEqual(1);
  });

  it('should be able to set the openContractualConditions', () => {
    store.dispatch(contractualConditionActions.setOpenContractualConditions(true));
    const { contractualCondition } = store.getState();
    expect(contractualCondition.openContractualConditions).toEqual(true);
  });

  it('should be able to clear the slice', () => {
    store.dispatch(contractualConditionActions.clearContractualConditions());
    const { contractualCondition } = store.getState();
    expect(contractualCondition.currentContractualCondition).toEqual(null);
    expect(contractualCondition.requestedBy).toEqual(null);
    expect(contractualCondition.text).toEqual('');
  });
});
