/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { ChatUtils } from '@shared/utils';
import { fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import { createQuoteMock, proposalResumeMock } from '../../../__mocks__';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import QuoteErrorFeedback from './QuoteErrorFeedback';

const createOrUpdateQuoteMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => createOrUpdateQuoteMock,
  };
});

describe('QuoteErrorFeedback', () => {
  beforeAll(async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should be able to render the quotation error feedback and call createOrUpdate function', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => Promise.reject({ message: 'error' }));
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByTestId } = render(<QuoteErrorFeedback />);
    fireEvent.click(getByTestId('alert-linkButton'));
    expect(createOrUpdateQuoteMock).toHaveBeenCalled();
  });

  it('should be able to note render the error feedback', async () => {
    await store.dispatch(quoteSliceActions.resetQuote());
    const { queryByTestId } = render(<QuoteErrorFeedback />);
    expect(await queryByTestId('alert-linkButton')).not.toBeInTheDocument();
  });

  it('should be able to render the proposal error feedback and call createOrUpdate function', async () => {
    store.dispatch(quoteSliceActions.setQuoteResumeData(proposalResumeMock));
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => Promise.reject({ message: 'error' }));
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByTestId } = render(<QuoteErrorFeedback />);
    fireEvent.click(getByTestId('alert-linkButton'));
    expect(createOrUpdateQuoteMock).toHaveBeenCalled();
  });

  it('should be able to render the custom error feedback', async () => {
    jest.spyOn(ChatUtils.zenDesk, 'open');
    jest.spyOn(QuoteApi, 'postQuotation').mockImplementation(async () =>
      Promise.reject({
        data: { data: { message: 'Taxa do tomador não encontrada.' } },
      }),
    );
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByTestId } = render(<QuoteErrorFeedback />);
    fireEvent.click(getByTestId('alert-linkButton'));
    expect(ChatUtils.zenDesk.open).toHaveBeenCalled();
  });
});
