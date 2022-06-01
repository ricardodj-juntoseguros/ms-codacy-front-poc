import { render } from '../../../config/testUtils';
import { FlowContainer } from './FlowContainer';

describe('FlowContainer component', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FlowContainer />);

    expect(baseElement).toBeTruthy();
  });
});
