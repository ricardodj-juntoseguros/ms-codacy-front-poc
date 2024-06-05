import '@testing-library/jest-dom';
import { act, fireEvent, render } from '../../../config/testUtils';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { putProposal } from '../../../application/features/proposal/ProposalSlice';
import { store } from '../../../config/store';
import ContractualCondition from './ContractualCondition';
import ContractualConditionApi from '../../../application/features/contractualCondition/ContractualConditionApi';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import {
  customClauseMock,
  policyholderMock,
  proposalMock,
} from '../../../__mocks__';
import { getCustomClause } from '../../../application/features/contractualCondition/ContractualConditionSlice';

describe('ContractualCondition', () => {
  const mockResult = {
    ProposalId: 12345,
    PolicyId: 11111,
    QuotationId: 12223,
    NewQuoterId: 123333,
    createdAt: '2024-01-01T12:00:00.000Z',
  };

  beforeAll(async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    jest
      .spyOn(ProposalApi, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
  });

  it('should be able to insert data for a customized clause', async () => {
    await store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { findByTestId } = render(<ContractualCondition />);
    const contractualConditionToggle = await findByTestId(
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
    await store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    await store.dispatch(getCustomClause(12345));
    const { findByTestId } = render(<ContractualCondition />);
    const contractualConditionToggle = await findByTestId(
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
