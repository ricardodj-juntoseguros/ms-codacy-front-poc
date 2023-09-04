import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import DashboardHeader from './DashboardHeader';
import { store } from '../../../config/store';

describe('DashboardHeader', () => {
  it('Should render successfully', () => {
    const component = render(
      <Provider store={store}>
        <DashboardHeader />
      </Provider>,
    );
    expect(component.getByText('Fidelize Dashboard')).toBeTruthy();
    expect(component.getByTestId('dashboard-opportunity-text')).toBeTruthy();
  });
});
