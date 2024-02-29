import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import IncentiveTrailRedeemModal from './IncentiveTrailRedeemModal';

describe('IncentiveTrailRedeemModal', () => {
  const onCloseModalMock = jest.fn();

  it('should be able to render the modal and click terms', () => {
    const windowOpen = jest.fn();
    window.open = windowOpen;
    const { getByTestId } = render(
      <IncentiveTrailRedeemModal onCloseModal={onCloseModalMock} toogleModal />,
    );
    fireEvent.click(getByTestId('incentiveTrailRedeemModal-linkButton-terms'));
    expect(windowOpen).toHaveBeenCalledWith(
      'https://static.juntoseguros.com/docs/Regulamento-Programa-de-Incentivo-Trilha-de-Incentivo-2024.pdf',
      '_blank',
    );
  });

  it('should be able to close modal', async () => {
    const windowOpen = jest.fn();
    window.open = windowOpen;
    const { getByTestId } = render(
      <IncentiveTrailRedeemModal onCloseModal={onCloseModalMock} toogleModal />,
    );
    fireEvent.click(getByTestId('modal-backdrop'));
    fireEvent.click(getByTestId('modal-close-button'));
    await waitFor(() => {
      expect(onCloseModalMock).toHaveBeenCalledTimes(3);
    });
  });
});
