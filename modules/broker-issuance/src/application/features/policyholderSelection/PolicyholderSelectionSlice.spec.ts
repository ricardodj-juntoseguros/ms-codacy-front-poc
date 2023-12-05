import { store } from '../../../config/store';
import PolicyholderSelectionApi from './PolicyholderSelectionApi';
import {
  policyholderAffiliateMock,
  policyholderSearchMock,
} from '../../../__mocks__';
import {
  searchPolicyholder,
  policyholderSelectionActions,
} from './PolicyholderSelectionSlice';

describe('PolicyholderSelectionSlice', () => {
  const optionsMock = [
    {
      companyName: 'Test',
      federalId: '99999999999999',
      id: 1,
      label: 'Test',
      value: '99999999999999',
    },
    {
      companyName: 'Test 2',
      federalId: '88888888888888',
      id: 2,
      label: 'Test 2',
      value: '88888888888888',
    },
  ];

  beforeEach(() => {
    store.dispatch(policyholderSelectionActions.clearPolicyholderSelection());
  });

  it('should be able to search policyholder by typed text', async () => {
    const policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));

    await store.dispatch(searchPolicyholder('Test'));

    const { policyholderSelection } = store.getState();

    expect(policyholderSearchApiMock).toHaveBeenCalled();
    expect(policyholderSearchApiMock).toHaveBeenCalledWith('Test');
    expect(policyholderSelection.policyholderOptions).toEqual(optionsMock);
  });

  it('Should not update the policyholder picklist if the error call', async () => {
    const policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.reject(new Error('Not found')));

    await store.dispatch(searchPolicyholder('Test'));

    const { policyholderSelection } = store.getState();

    expect(policyholderSearchApiMock).toHaveBeenCalled();
    expect(policyholderSearchApiMock).toHaveBeenCalledWith('Test');
    expect(policyholderSelection.policyholderOptions).toEqual([]);
    expect(policyholderSelection.loadingSearchPolicyholder).toEqual(false);
  });

  it('should be able to change the search value and if it is blank text you must clear the selection options', async () => {
    await store.dispatch(
      policyholderSelectionActions.setPolicyholderSearchValue('Test'),
    );
    let { policyholderSelection } = store.getState();
    expect(policyholderSelection.policyholderSearchValue).toEqual('Test');
    await store.dispatch(
      policyholderSelectionActions.setPolicyholderSearchValue(''),
    );
    policyholderSelection = store.getState().policyholderSelection;
    expect(policyholderSelection.policyholderSearchValue).toEqual('');
    expect(policyholderSelection.policyholderOptions).toEqual([]);
  });

  it('should be able to change the search value and if it is blank text you must clear the selection options', async () => {
    await store.dispatch(
      policyholderSelectionActions.setPolicyholderAffiliatesOptions([
        policyholderAffiliateMock,
      ]),
    );
    const { policyholderSelection } = store.getState();
    expect(policyholderSelection.affiliatesOptions.length).toEqual(3);
    expect(policyholderSelection.affiliatesOptions[0].companyName).toEqual(
      'DEXCO S.A',
    );
    expect(policyholderSelection.affiliatesOptions[1].label).toEqual(
      'Nenhuma filial',
    );
    expect(policyholderSelection.affiliatesOptions[2].label).toEqual(
      'Não encontrei minha filial',
    );
  });

  it('should be able reset the slice', async () => {
    const policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));

    await store.dispatch(searchPolicyholder('Test'));

    let { policyholderSelection } = store.getState();

    expect(policyholderSearchApiMock).toHaveBeenCalled();
    expect(policyholderSearchApiMock).toHaveBeenCalledWith('Test');
    expect(policyholderSelection.policyholderOptions).toEqual(optionsMock);

    store.dispatch(policyholderSelectionActions.clearPolicyholderSelection());
    policyholderSelection = store.getState().policyholderSelection;

    expect(policyholderSelection.policyholderOptions).toEqual([]);
    expect(policyholderSelection.loadingSearchPolicyholder).toEqual(false);
    expect(policyholderSelection.loadingGetSubsidiaries).toEqual(false);
  });
});
