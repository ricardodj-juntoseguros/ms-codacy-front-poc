import { store } from '../../../config/store';
import PolicyholderSelectionApi from './PolicyholderSelectionApi';
import { policyholderSearchMock, subsidiaryMock } from '../../../__mocks__';
import {
  searchPolicyholder,
  policyholderSelectionActions,
  getSubsidiaryByPolicyHolderId,
} from './PolicyholderSelectionSlice';

describe('PolicyholderSelectionSlice', () => {
  const optionsMock = [
    {
      id: 1,
      federalId: '99999999999999',
      companyName: 'Test',
    },
    {
      id: 2,
      federalId: '88888888888888',
      companyName: 'Test 2',
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

  it('should be able to search policyholder subsidiaries by policyholder', async () => {
    const policyHolderId = 140139;
    const subsidiaryOptionsMock = [
      { ...subsidiaryMock, label: 'Curitiba - PR - 99999999999999' },
    ];

    const getSubsidiaryByPolicyHolderApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'getSubsidiaryByPolicyHolder')
      .mockImplementation(() => Promise.resolve(subsidiaryOptionsMock));

    await store.dispatch(getSubsidiaryByPolicyHolderId(policyHolderId));

    const { policyholderSelection } = store.getState();

    expect(getSubsidiaryByPolicyHolderApiMock).toHaveBeenCalled();
    expect(getSubsidiaryByPolicyHolderApiMock).toHaveBeenCalledWith(
      policyHolderId,
    );
    expect(policyholderSelection.subsidiaryOptions).toEqual(
      subsidiaryOptionsMock,
    );
  });

  it('Should not update the subsidiary picklist if the error call', async () => {
    const policyHolderId = 140139;

    const getSubsidiaryByPolicyHolderApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'getSubsidiaryByPolicyHolder')
      .mockImplementation(() => Promise.reject(new Error('Not found')));

    await store.dispatch(searchPolicyholder('Test'));

    const { policyholderSelection } = store.getState();

    expect(getSubsidiaryByPolicyHolderApiMock).toHaveBeenCalled();
    expect(getSubsidiaryByPolicyHolderApiMock).toHaveBeenCalledWith(
      policyHolderId,
    );
    expect(policyholderSelection.subsidiaryOptions).toEqual([]);
    expect(policyholderSelection.loadingGetSubsidiaries).toEqual(false);
  });

  it('should be able reset the slice', async () => {
    const policyHolderId = 140139;
    const subsidiaryOptionsMock = [
      { ...subsidiaryMock, label: 'Curitiba - PR - 99999999999999' },
    ];
    const policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));
    const getSubsidiaryByPolicyHolderApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'getSubsidiaryByPolicyHolder')
      .mockImplementation(() => Promise.resolve(subsidiaryOptionsMock));

    await store.dispatch(searchPolicyholder('Test'));
    await store.dispatch(getSubsidiaryByPolicyHolderId(policyHolderId));

    let { policyholderSelection } = store.getState();

    expect(policyholderSearchApiMock).toHaveBeenCalled();
    expect(policyholderSearchApiMock).toHaveBeenCalledWith('Test');
    expect(policyholderSelection.policyholderOptions).toEqual(optionsMock);
    expect(getSubsidiaryByPolicyHolderApiMock).toHaveBeenCalled();
    expect(getSubsidiaryByPolicyHolderApiMock).toHaveBeenCalledWith(
      policyHolderId,
    );
    expect(policyholderSelection.subsidiaryOptions).toEqual(
      subsidiaryOptionsMock,
    );

    store.dispatch(policyholderSelectionActions.clearPolicyholderSelection());
    policyholderSelection = store.getState().policyholderSelection;

    expect(policyholderSelection.policyholderOptions).toEqual([]);
    expect(policyholderSelection.loadingSearchPolicyholder).toEqual(false);
    expect(policyholderSelection.subsidiaryOptions).toEqual([]);
    expect(policyholderSelection.loadingGetSubsidiaries).toEqual(false);
  });
});
