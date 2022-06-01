import { renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';
import * as store from '../../../config/store';
import { storeMock } from '../../../__mocks__';
import { useGenerateQuote } from '../useGenerateQuote';

describe('useGenerateQuote component', () => {
  const mockDispatch = jest.fn();
  let useDispatchMock: jest.SpyInstance;
  let useAppDispatchMock: jest.SpyInstance;

  beforeEach(() => {
    useDispatchMock = jest.spyOn(reactRedux, 'useSelector');
    useAppDispatchMock = jest.spyOn(store, 'useAppDispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to return if quote not have changes', async () => {
    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    const { result } = renderHook(useGenerateQuote);

    const { quoteGeneratedSuccessfully } =
      await result.current.fechGenerateQuote();

    expect(quoteGeneratedSuccessfully).toEqual(false);
  });

  it('should be able to return if quote not pass to validate', async () => {
    useDispatchMock.mockImplementation(select =>
      select({
        ...storeMock,
        quote: { ...storeMock.quote, hasQuoteChanges: true },
      }),
    );
    useAppDispatchMock.mockImplementation(() =>
      jest.fn(() => ({ payload: { isValidForm: false } })),
    );

    const { result } = renderHook(useGenerateQuote);

    const { quoteGeneratedSuccessfully } =
      await result.current.fechGenerateQuote();

    expect(quoteGeneratedSuccessfully).toEqual(false);
  });

  it('should be able to return if quote not pass to validate', async () => {
    const mockDispatch = jest
      .fn()
      .mockImplementationOnce(() => ({ payload: { isValidForm: true } }))
      .mockImplementationOnce(() => jest.fn());
    useDispatchMock.mockImplementation(select =>
      select({
        ...storeMock,
        quote: { ...storeMock.quote, hasQuoteChanges: true },
      }),
    );
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    const { result } = renderHook(useGenerateQuote);

    const { quoteGeneratedSuccessfully } =
      await result.current.fechGenerateQuote();

    expect(quoteGeneratedSuccessfully).toEqual(true);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });
});
