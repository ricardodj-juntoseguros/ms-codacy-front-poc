import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import OpportunityDetailsModalMail from './OpportunityDetailsModalMail';

const onSubmitMock = jest.fn();
const component = () =>
  render(
    <OpportunityDetailsModalMail
      isSubmitting={false}
      onSubmit={onSubmitMock}
      renderSubmitError={() => <div />}
    />,
  );

describe('OpportunityDetailsModalMail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should have disabled button if input is empty', () => {
    const { getByTestId } = component();
    const input = getByTestId('mail-input-more-details');
    fireEvent.change(input, { target: { value: '  ' } });
    expect(getByTestId('submit-more-details-email')).toBeDisabled();
  });

  it('Should display error message if invalid email is submitted', () => {
    const { getByTestId, getByText } = component();
    const input = getByTestId('mail-input-more-details');
    const submitButton = getByTestId('submit-more-details-email');
    fireEvent.change(input, { target: { value: 'invalid input' } });
    fireEvent.click(submitButton);
    expect(getByText('Digite um e-mail válido.')).toBeInTheDocument();
  });

  it('Should call onSubmit callback on submit if email is valid', () => {
    const { getByTestId } = component();
    const input = getByTestId('mail-input-more-details');
    fireEvent.change(input, { target: { value: 'teste@juntoseguros.com' } });
    fireEvent.submit(input);
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });
});
