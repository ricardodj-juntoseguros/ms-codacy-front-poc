import {
  fireEvent,
  render,
} from 'modules/broker-issuance/src/config/testUtils';
import PolicyholderAndModalityFormWrapper from './PolicyholderAndModalityFormWrapper';

const advanceStepMock = jest.fn();
jest.mock('@shared/hooks', () => {
  const originalModule = jest.requireActual('@shared/hooks');
  return {
    __esModule: true,
    ...originalModule,
    useFlow: () => ({
      advanceStep: advanceStepMock,
    }),
  };
});

describe('PolicyholderAndModalityFormWrapper', () => {
  it('should be able to call the submit function correctly', () => {
    const { getByText } = render(
      <PolicyholderAndModalityFormWrapper name="test">
        <button type="submit">submit</button>
      </PolicyholderAndModalityFormWrapper>,
    );
    fireEvent.click(getByText('submit'));
    expect(advanceStepMock).toHaveBeenCalledWith('test');
  });
});
