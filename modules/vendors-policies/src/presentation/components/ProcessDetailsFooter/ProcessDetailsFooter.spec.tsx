import '@testing-library/jest-dom';
import { act, fireEvent, render } from '../../../config/testUtils';
import ProcessDetailsFooter from './ProcessDetailsFooter';

describe('ProcessDetailsFooter', () => {
  const windowOpen = jest.fn();
  window.open = windowOpen;
  process.env.NX_GLOBAL_MS_DOCUMENTS = '';

  it('Should render correctly', async () => {
    const { getByTestId } = render(
      <ProcessDetailsFooter
        processStatusConfig={{ id: 5 }}
        userType="insured"
      />,
    );

    const certificateButton = getByTestId(
      'processDetailsFooterProps-button-certificate',
    );
    const inssuanceClaimButton = getByTestId(
      'processDetailsFooterProps-button-issuance-claim',
    );

    expect(certificateButton).toBeInTheDocument();
    expect(inssuanceClaimButton).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(certificateButton);
    });
    await act(async () => {
      await fireEvent.click(inssuanceClaimButton);
    });

    expect(windowOpen).toHaveBeenCalledWith(
      'certificateRegularity/download?format=pdf',
      '_blank',
    );
    expect(windowOpen).toHaveBeenCalledWith(
      'https://www.juntoseguros.com/canal-de-sinistro/',
      '_blank',
    );
  });

  it('Should render correctly', async () => {
    const { getByTestId, queryByTestId } = render(
      <ProcessDetailsFooter
        processStatusConfig={{ id: 5 }}
        userType="policyholder"
      />,
    );

    const certificateButton = getByTestId(
      'processDetailsFooterProps-button-certificate',
    );
    const inssuanceClaimButton = await queryByTestId(
      'processDetailsFooterProps-button-issuance-claim',
    );

    expect(certificateButton).toBeInTheDocument();
    expect(inssuanceClaimButton).not.toBeInTheDocument();
  });
});
