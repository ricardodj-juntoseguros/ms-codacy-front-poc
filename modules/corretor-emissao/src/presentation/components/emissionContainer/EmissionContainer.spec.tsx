import { render } from '../../../config/testUtils';
import { EmissionContainer } from './EmissionContainer';

describe('EmissionContainer component', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EmissionContainer />);

    expect(baseElement).toBeTruthy();
  });
});
