/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import LeaseBondsForm from './LeaseBondsForm';

describe('LeaseBondsForm', () => {
  it('Should renders LeaseBondsForm component correctly', async () => {
    const { getByTestId } = render(<LeaseBondsForm />);

    const formElement = getByTestId('leaseBondsForm-form');
    expect(formElement).toBeInTheDocument();
  });
});
