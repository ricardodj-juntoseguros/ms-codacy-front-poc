import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import { DISCLAIMERS } from '../../../constants';
import ResolutionCNSP382 from './ResolutionCNSP382';

describe('ResolutionCNSP382', () => {
  it('should be able to render the ResolutionCNSP382 component', () => {
    const { getByText } = render(<ResolutionCNSP382 />);
    expect(getByText('Importante')).toBeInTheDocument();
    expect(getByText(DISCLAIMERS.resolutionCNSP382)).toBeInTheDocument();
  });
});
