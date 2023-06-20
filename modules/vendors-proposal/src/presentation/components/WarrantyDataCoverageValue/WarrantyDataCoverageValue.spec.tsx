import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import WarrantyDataCoverageValue from './WarrantyDataCoverageValue';

describe('WarrantyDataCoverageValue', () => {
  it('should calculate and render correctly', () => {
    const { baseElement, getByText } = render(
      <WarrantyDataCoverageValue totalValue={800} />,
    );

    const value = getByText('R$ 800,00');

    expect(baseElement).toBeInTheDocument();
    expect(value).toBeInTheDocument();
  });
});
