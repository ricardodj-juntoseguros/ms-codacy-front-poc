/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { downloadFile } from '@shared/utils';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { makeToast } from 'junto-design-system';
import { fireEvent, render } from '../../../config/testUtils';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import { createQuoteMock, quoteResultMock } from '../../../__mocks__';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { store } from '../../../config/store';
import ValidityAndValueFooter from './ValidityAndValueFooter';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

jest.mock('@shared/utils', () => {
  const originalModule = jest.requireActual('@shared/utils');
  return {
    __esModule: true,
    ...originalModule,
    downloadFile: jest.fn(),
  };
});

describe('ValidityAndValueFooter', () => {
  const submitMock = jest.fn();

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

  beforeEach(() => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.BROKER);
  });

  it('should be able to trigger the submit if you have a valid quote and there are no changes to the quote', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByTestId } = render(
      <form onSubmit={() => submitMock()}>
        <ValidityAndValueFooter />
      </form>,
    );
    const submitButton = getByTestId('validityAndValueFooter-button-submit');
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    expect(submitMock).toHaveBeenCalled();
  });

  it('should have submit button disabled if there is no currentQuote in store', async () => {
    store.dispatch(quoteSliceActions.resetQuote());
    const { getByTestId } = render(
      <form onSubmit={() => submitMock()}>
        <ValidityAndValueFooter />
      </form>,
    );
    const submitButton = getByTestId('validityAndValueFooter-button-submit');
    expect(submitButton).toBeDisabled();
  });

  it('should be able to download quotation document if there is a valid current quote', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    const downloadMock = jest
      .spyOn(QuoteApi, 'getQuotationDocument')
      .mockImplementation(async () => 'Ok');
    const { getByTestId } = render(<ValidityAndValueFooter />);
    await store.dispatch(postQuotation(createQuoteMock));
    const downloadButton = getByTestId(
      'validityAndValueFooter-button-download',
    );
    expect(downloadButton).not.toBeDisabled();
    await act(async () => {
      await fireEvent.click(downloadButton);
    });
    expect(downloadMock).toHaveBeenCalledWith(1868859);
    expect(downloadFile).toHaveBeenCalled();
  });

  it('should be able to disable the quote download button if there is no valid quote', async () => {
    store.dispatch(quoteSliceActions.resetQuote());
    const { findByTestId } = render(<ValidityAndValueFooter />);
    const download = await findByTestId(
      'validityAndValueFooter-button-download',
    );
    expect(download).toBeDisabled();
  });

  it('should be able to not show the download button if the user is a policyholder', async () => {
    store.dispatch(quoteSliceActions.resetQuote());
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.POLICYHOLDER);
    const { queryByTestId } = render(<ValidityAndValueFooter />);
    await store.dispatch(postQuotation(createQuoteMock));
    const download = await queryByTestId(
      'validityAndValueFooter-button-download',
    );
    expect(download).not.toBeInTheDocument();
  });
});
