import { render } from '../../../config/testUtils';
import { ContractDataContainer } from './ContractDataContainer';

describe('ContractDataContainer component', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContractDataContainer />);

    expect(baseElement).toBeTruthy();
  });
});
