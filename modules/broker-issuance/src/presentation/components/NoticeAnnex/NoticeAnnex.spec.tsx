import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import NoticeAnnex from './NoticeAnnex';

const updateProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useProposal: () => updateProposalMock,
  };
});

describe('NoticeAnnex', () => {
  it('should be able to fill in the bidding description and when leaving the field the hook must be called', async () => {
    const { getByTestId } = render(<NoticeAnnex />);
    const input = getByTestId('noticeAnnex-biddingDescription-input');
    fireEvent.change(input, {
      target: { value: '123456' },
    });
    fireEvent.blur(input);
    const state = store.getState();
    expect(state.proposal.biddingDescription).toBe('123456');
    expect(updateProposalMock).toHaveBeenCalled();
  });
});
