import '@testing-library/jest-dom';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { putProposal } from '../../../application/features/proposal/ProposalSlice';
import { policyholderMock, proposalMock } from '../../../__mocks__';
import { act, fireEvent, render } from '../../../config/testUtils';
import { DISCLAIMERS } from '../../../constants';
import { store } from '../../../config/store';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import ProposalParticularities from './ProposalParticularities';

const createProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useProposal: () => createProposalMock,
  };
});

describe('ProposalParticularities', () => {
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
  });

  it('should be able to add a particularity', async () => {
    const { getByTestId, findByTestId, getByText } = render(
      <ProposalParticularities />,
    );
    await act(async () => {
      fireEvent.click(
        getByTestId('proposalParticularities-specialAnalysisRequired-toggle'),
      );
    });
    const textArea = await findByTestId(
      'proposalParticularities-specialAnalysisDescription-text-area',
    );
    await act(async () => {
      await fireEvent.change(textArea, { target: { value: 'test' } });
      await fireEvent.blur(textArea);
    });
    const state = store.getState();
    expect(state.proposal.specialAnalysisRequired).toBe(true);
    expect(state.proposal.specialAnalysisDescription).toBe('test');
    expect(createProposalMock).toBeCalledTimes(1);
    expect(
      getByText(
        'Ao informar ajustes e particularidades na proposta, esta será automaticamente encaminhada para análise de nossa equipe. Após essa avaliação, entraremos em contato.',
      ),
    ).toBeInTheDocument();
    expect(getByText(DISCLAIMERS.resolutionCNSP382)).toBeInTheDocument();
  });

  it('should be able to display the fields for the contractual conditions', async () => {
    jest
      .spyOn(ProposalApi, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    await store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { findByTestId } = render(<ProposalParticularities />);
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
    expect(policyholderRadioButton).toBeInTheDocument();
    expect(textAreaInput).toBeInTheDocument();
  });
});
