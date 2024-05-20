/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { store } from '../../../config/store';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import {
  createQuoteMock,
  proposalResumeMock,
  quoteResultMock,
} from '../../../__mocks__';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import ValidityAndValueFormWrapper from './ValidityAndValueFormWrapper';

const advanceStepMock = jest.fn();
const mockHook = jest.fn();

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
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => mockHook,
  };
});
describe('ValidityAndValueForm', () => {
  beforeEach(() => {
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('should be able to call the submit function', async () => {
    const { getByTestId } = render(
      <ValidityAndValueFormWrapper name="test">
        <button
          type="submit"
          data-testid="validityAndValueFormWrapper-button-submit"
        >
          test
        </button>
      </ValidityAndValueFormWrapper>,
    );
    fireEvent.click(getByTestId('validityAndValueFormWrapper-button-submit'));
    expect(advanceStepMock).toHaveBeenCalled();
  });

  it('should be able to call the submit function', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    await store.dispatch(
      quoteSliceActions.setQuoteResumeData(proposalResumeMock),
    );
    render(<ValidityAndValueFormWrapper name="test" />);
    await waitFor(() => {
      expect(mockHook).toHaveBeenCalled();
    });
  });
});
