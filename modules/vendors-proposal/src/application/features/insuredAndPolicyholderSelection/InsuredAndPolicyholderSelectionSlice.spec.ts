import { waitFor } from '@testing-library/react';
import { store } from '../../../config/store';
import {
  insuredAndPolicyholderSelectionActions,
  getPolicyholderAffiliates,
  searchPolicyholders,
} from './InsuredAndPolicyholderSelectionSlice';
import InsuredAndPolicyholderSelectionApi from './InsuredAndPolicyholderSelectionApi';
import {
  policyholdersMock,
  policyholderAffiliatesMock,
} from '../../../__mocks__';

describe('InsuredAndPolicyholderSelectionSlice', () => {
  it('should set the policyholder input value correctly', async () => {
    await store.dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderInputValue('12345'),
    );
    const { insuredAndPolicyholderSelection } = store.getState();
    expect(insuredAndPolicyholderSelection.policyholderInputValue).toEqual(
      '12345',
    );
  });

  it('should clear the policyholder and policyholder affiliate results if inputValue is blank', async () => {
    await store.dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderResults([
        {
          federalId: '12345671234567',
          corporateName: 'Teste',
          externalPolicyholderId: 123,
        },
      ]),
    );
    await store.dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderAffiliateResults(
        policyholderAffiliatesMock,
      ),
    );
    await store.dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderInputValue(''),
    );
    const { insuredAndPolicyholderSelection } = store.getState();
    await waitFor(() => {
      expect(insuredAndPolicyholderSelection.policyholderResults).toBeNull();
      expect(
        insuredAndPolicyholderSelection.policyholderAffiliateResults,
      ).toBeNull();
    });
  });

  it('should set IsValidFederalId correctly', async () => {
    await store.dispatch(
      insuredAndPolicyholderSelectionActions.setIsValidFederalId(true),
    );
    const { insuredAndPolicyholderSelection } = store.getState();
    expect(insuredAndPolicyholderSelection.isValidFederalId).toBeTruthy();
  });

  it('searchPolicyholders thunk should call api and set state correctly on success', async () => {
    const apiMock = jest
      .spyOn(InsuredAndPolicyholderSelectionApi.prototype, 'getPolicyholders')
      .mockImplementation(async () => {
        return policyholdersMock;
      });

    const result = await store.dispatch(searchPolicyholders('12345671234567'));
    expect(apiMock).toHaveBeenCalledWith('12345671234567', undefined);
    expect(result.payload).toStrictEqual(policyholdersMock);
    const expectedState =
      store.getState().insuredAndPolicyholderSelection.policyholderResults;
    expect(expectedState).toStrictEqual(policyholdersMock);
  });

  it('searchPolicyholders thunk should clear policyholder results if api call fails', async () => {
    await store.dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderResults(
        policyholdersMock,
      ),
    );
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi.prototype, 'getPolicyholders')
      .mockImplementation(async () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ data: { data: { message: 'Erro' } } });
      });

    await store.dispatch(searchPolicyholders('12345671234567'));
    const expectedState =
      store.getState().insuredAndPolicyholderSelection.policyholderResults;
    expect(expectedState).toHaveLength(0);
  });

  it('should set policyholderAffiliateresults correctly', async () => {
    await store.dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderAffiliateResults(
        policyholderAffiliatesMock,
      ),
    );
    const { insuredAndPolicyholderSelection } = store.getState();
    expect(
      insuredAndPolicyholderSelection.policyholderAffiliateResults,
    ).toStrictEqual(policyholderAffiliatesMock);
  });

  it('getPolicyholderAffiliates thunk should call api and set state correctly on success', async () => {
    const apiMock = jest
      .spyOn(
        InsuredAndPolicyholderSelectionApi.prototype,
        'getPolicyholderAffiliates',
      )
      .mockImplementation(async () => {
        return policyholderAffiliatesMock;
      });

    const result = await store.dispatch(
      getPolicyholderAffiliates('12345671234567'),
    );
    expect(apiMock).toHaveBeenCalledWith('12345671234567');
    expect(result.payload).toStrictEqual(policyholderAffiliatesMock);
    const expectedState =
      store.getState().insuredAndPolicyholderSelection
        .policyholderAffiliateResults;
    expect(expectedState).toStrictEqual(policyholderAffiliatesMock);
  });

  it('getPolicyholderAffiliates thunk should clear policyholder affiliate results if api call fails', async () => {
    await store.dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderAffiliateResults(
        policyholderAffiliatesMock,
      ),
    );
    jest
      .spyOn(
        InsuredAndPolicyholderSelectionApi.prototype,
        'getPolicyholderAffiliates',
      )
      .mockImplementation(async () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ data: { data: { message: 'Erro' } } });
      });

    await store.dispatch(getPolicyholderAffiliates('12345671234567'));
    const expectedState =
      store.getState().insuredAndPolicyholderSelection
        .policyholderAffiliateResults;
    expect(expectedState).toHaveLength(0);
  });
});
