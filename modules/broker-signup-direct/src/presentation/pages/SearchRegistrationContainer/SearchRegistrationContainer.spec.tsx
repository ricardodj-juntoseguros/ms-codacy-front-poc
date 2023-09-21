import { render } from '../../../config/testUtils';
import  SearchRegistration  from './SearchRegistrationContainer';

describe('SearchRegistration component', () => {
  const historyMock = jest.fn();

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  it('should render successfully', () => {
    const { baseElement } = render(<SearchRegistration {...props}/>);

    expect(baseElement).toBeTruthy();
  });
});
