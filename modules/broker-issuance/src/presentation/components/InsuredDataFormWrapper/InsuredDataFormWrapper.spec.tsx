import { act, fireEvent, render } from '../../../config/testUtils';
import InsuredDataFormWrapper from './InsuredDataFormWrapper';

const createProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useProposal: () => createProposalMock,
  };
});

describe('InsuredDataFormWrapper', () => {
  it('should be able to call the submit function', async () => {
    const { getByText } = render(
      <InsuredDataFormWrapper name="InsuredDataFormWrapper">
        <button type="submit">submit</button>
      </InsuredDataFormWrapper>,
    );
    await act(async () => {
      await fireEvent.click(getByText('submit'));
    });
    expect(createProposalMock).toBeCalledTimes(1);
  });
});
