import '@testing-library/jest-dom';
import { act, fireEvent, render } from '../../../config/testUtils';
import ProposalSummaryAside from './ProposalSummaryAside';

describe('ProposalSummaryAside', () => {
  const handleSubmitMock = jest.fn();
  const handleEditMock = jest.fn();

  it('should correctly call functions on button clicks', async () => {
    const { getByTestId } = render(
      <ProposalSummaryAside
        handleSubmit={handleSubmitMock}
        handleEdit={handleEditMock}
        loading={false}
      />,
    );

    const handleSubmitButton = getByTestId(
      'proposalSummaryAside-button-submit',
    );
    const handleEditButton = getByTestId('proposalSummaryAside-button-edit');

    await act(async () => {
      await fireEvent.click(handleSubmitButton);
    });

    await act(async () => {
      await fireEvent.click(handleEditButton);
    });

    expect(handleSubmitMock).toHaveBeenCalled();
    expect(handleEditMock).toHaveBeenCalled();
  });

  it('should correctly render the loading', async () => {
    const { getByTestId } = render(
      <ProposalSummaryAside
        handleSubmit={handleSubmitMock}
        handleEdit={handleEditMock}
        loading
      />,
    );

    const loadingSpinner = getByTestId('loading-spinner');

    expect(loadingSpinner).toBeInTheDocument();
  });
});
