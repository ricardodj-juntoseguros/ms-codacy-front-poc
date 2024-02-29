import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import IncentiveTrailHeader from './IncentiveTrailHeader';

describe('IncentiveTrailCard', () => {
  const windowOpen = jest.fn();
  window.open = windowOpen;

  it('should redirect to the incentive trail terms url', () => {
    const { getByTestId } = render(<IncentiveTrailHeader />);
    fireEvent.click(getByTestId('incentiveTrailHeader-linkButton-terms'));
    expect(windowOpen).toHaveBeenCalledWith(
      'https://static.juntoseguros.com/docs/Regulamento-Programa-de-Incentivo-Trilha-de-Incentivo-2024.pdf',
      '_blank',
    );
  });
});
