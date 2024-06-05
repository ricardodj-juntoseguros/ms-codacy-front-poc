import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import { CommercialAuthorizationTypeEnum } from '../../../application/types/model';
import CommercialAuthorizationModal from './CommercialAuthorizationModal';

describe('CommercialAuthorizationModal', () => {
  const onConfirmMock = jest.fn();
  const onToggleModalMock = jest.fn();

  it('should be able to open the modal and click the submit button', () => {
    const { getByTestId } = render(
      <CommercialAuthorizationModal
        isModalOpen
        modalType={CommercialAuthorizationTypeEnum.sendToApproval}
        onConfirm={onConfirmMock}
        onToggleModal={onToggleModalMock}
      />,
    );
    const buttonSubmit = getByTestId(
      'commercialAuthorizationModal-button-submit',
    );
    fireEvent.click(buttonSubmit);
    expect(onConfirmMock).toHaveBeenCalled();
    expect(onToggleModalMock).toHaveBeenCalledWith('');
  });

  it('should be able to open the modal and click the close button', () => {
    const { getByTestId } = render(
      <CommercialAuthorizationModal
        isModalOpen
        modalType={CommercialAuthorizationTypeEnum.sendToApproval}
        onConfirm={onConfirmMock}
        onToggleModal={onToggleModalMock}
      />,
    );
    const buttonClose = getByTestId(
      'commercialAuthorizationModal-button-close',
    );
    fireEvent.click(buttonClose);
    expect(onToggleModalMock).toHaveBeenCalledWith('');
  });
});
