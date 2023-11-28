import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '../../../config/testUtils';
import PolicyholderAppointmentLetter from './PolicyholderAppointmentLetter';

describe('PolicyholderAppointmentLetter', () => {
  const onRemoveFileMock = jest.fn();
  const onUploadFileMock = jest.fn();
  const windowOpen = jest.fn();
  window.open = windowOpen;

  it('should be able to download appointment letter template', async () => {
    const { getByTestId } = render(
      <PolicyholderAppointmentLetter
        file={[]}
        onUploadFile={onUploadFileMock}
        onRemoveFile={onRemoveFileMock}
      />,
    );
    const button = getByTestId(
      'policyholderAppointmentLetterProps-button-download-template',
    );
    await act(async () => {
      await fireEvent.click(button);
    });
    expect(window.open).toHaveBeenCalledWith(
      'https://static.juntoseguros.com/docs/Carta+de+Nomeac%CC%A7a%CC%83o+do+Corretor.docx',
      '_blank',
    );
  });
});
