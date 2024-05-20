import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import { store } from '../../../config/store';
import { render, fireEvent } from '../../../config/testUtils';
import ProposalContacts from './ProposalContacts';
import '@testing-library/jest-dom';

describe('ProposalContacts', () => {
  beforeEach(() => {
    store.dispatch(proposalActions.setContacts([]));
  });

  it('should be able to fill a contact and send it to store', () => {
    const { getByTestId } = render(<ProposalContacts />);
    fireEvent.click(getByTestId('proposalContacts-toggle-button'));
    fireEvent.change(getByTestId('proposalContacts-input-contact'), {
      target: { value: 'teste@juntoseguros.com' },
    });
    fireEvent.click(getByTestId('proposalContacts-button-add'));
    expect(store.getState().proposal.contacts).toEqual([
      'teste@juntoseguros.com',
    ]);
  });

  it('should be able to delete a from the store', () => {
    store.dispatch(proposalActions.setContacts(['teste@juntoseguros.com']));
    const { getByTestId, getByText } = render(<ProposalContacts />);
    fireEvent.click(getByTestId('proposalContacts-toggle-button'));
    expect(getByText('teste@juntoseguros.com')).toBeInTheDocument();
    fireEvent.click(getByTestId('proposalContacts-link-button-remove-contact'));
    expect(store.getState().proposal.contacts).toEqual([]);
  });
});
