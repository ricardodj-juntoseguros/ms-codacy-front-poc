import { render } from '@testing-library/react';
import { store } from 'modules/fidelize-dashboard/src/config/store';
import { Provider } from 'react-redux';
import DashboardContainer from './DashboardContainer';

describe('DashboardContainer', () => {
  it('Should render successfully', () => {
    const component = render(
      <Provider store={store}>
        <DashboardContainer />
      </Provider>,
    );
    expect(component.container).toBeTruthy();
  });
});
