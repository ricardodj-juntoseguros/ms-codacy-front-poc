import { store } from '../../../config/store';
import { fireEvent, render } from '../../../config/testUtils';
import ProposalComments from './ProposalComments';

const createProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useProposal: () => createProposalMock,
  };
});

describe('ProposalComments', () => {
  it('should be able to include a comment', () => {
    const { getByTestId } = render(<ProposalComments />);
    const textArea = getByTestId('proposalComments-text-area-comments');
    fireEvent.change(textArea, { target: { value: 'comment' } });
    fireEvent.blur(textArea);
    const state = store.getState();
    expect(state.proposal.comments).toBe('comment');
    expect(createProposalMock).toHaveBeenCalled();
  });
});
