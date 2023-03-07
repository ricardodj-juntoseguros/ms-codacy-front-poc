import { render } from '../../../config/testUtils';
import  SearchRegistration  from './SearchRegistrationContainer';

describe('SearchRegistration component', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchRegistration />);

    expect(baseElement).toBeTruthy();
  });
});
