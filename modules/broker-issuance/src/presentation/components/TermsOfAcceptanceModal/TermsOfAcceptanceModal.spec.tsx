import { fireEvent, render } from '../../../config/testUtils';
import TermsOfAcceptanceModal from './TermsOfAcceptanceModal';

describe('TermsOfAcceptanceModal', () => {
  const onToggleModalMock = jest.fn();

  it('should be able to close a modal', async () => {
    const { getByTestId } = render(
      <TermsOfAcceptanceModal isModalOpen onToggleModal={onToggleModalMock} />,
    );
    fireEvent.click(getByTestId('termsOfAcceptanceModal-button-close'));
    expect(onToggleModalMock).toHaveBeenCalled();
    fireEvent.click(getByTestId('modal-backdrop'));
    expect(onToggleModalMock).toHaveBeenCalled();
  });
});
