import { render } from '@testing-library/react';
import DashboardContainer from './DashboardContainer';

describe('DashboardContainer', () => {
  it('Should render successfully', () => {
    const component = render(<DashboardContainer />);
    expect(component.container).toBeTruthy();
  });
});
