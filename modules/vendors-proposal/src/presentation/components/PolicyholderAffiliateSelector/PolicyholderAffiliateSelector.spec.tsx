import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import { insuredAndPolicyholderSelectionActions } from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionSlice';
import { store } from '../../../config/store';
import { policyholderAffiliatesMock } from '../../../__mocks__';
import PolicyholderAffiliateSelector from './PolicyholderAffiliateSelector';

describe('PolicyholderAffiliateSelector', () => {
  beforeAll(() => {
    store.dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderAffiliateResults(
        policyholderAffiliatesMock,
      ),
    );
  });

  it('Should render affiliate options correctly according to the store', async () => {
    const { findByText } = render(<PolicyholderAffiliateSelector />);
    expect(
      await findByText('Curitiba - PR - CNPJ: 65.182.718/0001-91'),
    ).toBeInTheDocument();
    expect(
      await findByText('Colombo - PR - CNPJ: 65.182.718/0002-91'),
    ).toBeInTheDocument();
    expect(
      await findByText('Curitiba - PR - CNPJ: 65.182.718/0003-91'),
    ).toBeInTheDocument();
  });

  it('Should dispatch affiliate values to proposal store on select', async () => {
    const { findByText } = render(<PolicyholderAffiliateSelector />);
    fireEvent.click(
      await findByText('Curitiba - PR - CNPJ: 65.182.718/0001-91'),
    );
    await waitFor(() => {
      expect(store.getState().proposal.policyholder.affiliateId).toBe(906);
      expect(store.getState().proposal.policyholder.affiliateFederalId).toBe(
        '65182718000191',
      );
    });
  });
});
