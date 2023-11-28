import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import ExpiredLinkContainer from './ExpiredLinkContainer';
import { store } from '../../../config/store';

describe('ExpiredLinkContainer component', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <Provider store={store}>
        <ExpiredLinkContainer />
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
    expect(
      getByText('Ops! Parece que tivemos um problema.'),
    ).toBeInTheDocument();
  });
});
