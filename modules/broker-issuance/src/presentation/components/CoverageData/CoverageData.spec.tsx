import { fireEvent, render } from '@testing-library/react';
import { quoteSliceActions } from 'modules/broker-issuance/src/application/features/quote/QuoteSlice';
import * as reactRedux from 'react-redux';
import { act } from 'react-dom/test-utils';
import { parseDateToString } from 'modules/broker-issuance/src/helpers';
import { policyholderLimitAdapter } from '../../../application/features/coverageData/adapters';

import { CoverageData } from './CoverageData';
import { policyholderLimitMock, storeMock } from '../../../__mocks__';
import CoverageApi from '../../../application/features/coverageData/CoverageApi';

describe('CoverageData component', () => {
  const mockDispatch = jest.fn();
  let useDispatchMock: jest.SpyInstance;
  let useAppDispatchMock: jest.SpyInstance;

  beforeEach(() => {
    useDispatchMock = jest.spyOn(reactRedux, 'useSelector');
    useAppDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    const { baseElement } = render(<CoverageData />);

    expect(baseElement).toBeTruthy();
  });

  it('should get limit coverage if store contais policyholder and modality', async () => {
    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    const apiMockLimit = jest
      .spyOn(CoverageApi, 'getLimitCoverage')
      .mockImplementation(() => Promise.resolve(policyholderLimitMock));

    render(<CoverageData />);

    const policyholderLimit = policyholderLimitAdapter(policyholderLimitMock);

    await apiMockLimit;

    expect(apiMockLimit).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      quoteSliceActions.setPolicyholderLimit(policyholderLimit),
    );
  });

  // it('should not call api limit and store if store not contains policyholder or modality', async () => {
  //   useDispatchMock.mockImplementation(select =>
  //     select({
  //       ...storeMock,
  //       quote: {
  //         ...storeMock.quote,
  //         policyholder: null,
  //         modality: null,
  //       },
  //     }),
  //   );
  //   useAppDispatchMock.mockImplementation(() => mockDispatch);

  //   const apiMockLimit = jest
  //     .spyOn(CoverageApi, 'getLimitCoverage')
  //     .mockImplementation(() => Promise.resolve(policyholderLimitMock));

  //   render(<CoverageData />);

  //   await apiMockLimit;

  //   expect(apiMockLimit).not.toHaveBeenCalled();
  //   expect(mockDispatch).not.toHaveBeenCalled();
  // });

  it('should call the store with to update start date value', async () => {
    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    jest
      .spyOn(CoverageApi, 'getLimitCoverage')
      .mockImplementation(() => Promise.resolve(policyholderLimitMock));

    const { getByTestId } = render(<CoverageData />);

    const startDateInput = getByTestId('start-date');

    await act(async () => {
      fireEvent.change(startDateInput, { target: { value: '28/05/2022' } });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      quoteSliceActions.setStartDate('28/05/2022'),
    );
  });

  it('should call the store with to update end date value', async () => {
    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    jest
      .spyOn(CoverageApi, 'getLimitCoverage')
      .mockImplementation(() => Promise.resolve(policyholderLimitMock));

    const { getByTestId } = render(<CoverageData />);

    const endDateInput = getByTestId('end-date');

    await act(async () => {
      fireEvent.change(endDateInput, { target: { value: '27/05/2023' } });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      quoteSliceActions.setEndDate('27/05/2023'),
    );
  });

  it('should call the store with to update duration in days value', async () => {
    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    jest
      .spyOn(CoverageApi, 'getLimitCoverage')
      .mockImplementation(() => Promise.resolve(policyholderLimitMock));

    const { getByTestId } = render(<CoverageData />);

    const durationInDaysInput = getByTestId('duration-in-days');

    await act(async () => {
      fireEvent.change(durationInDaysInput, { target: { value: 365 } });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      quoteSliceActions.setDurationInDays(365),
    );
  });

  it('should call the store with to update secured amount value', async () => {
    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    jest
      .spyOn(CoverageApi, 'getLimitCoverage')
      .mockImplementation(() => Promise.resolve(policyholderLimitMock));

    const { getByTestId } = render(<CoverageData />);

    const securedAmountInput = getByTestId('secured-amount');

    await act(async () => {
      fireEvent.change(securedAmountInput, { target: { value: 'R$ 1000,00' } });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      quoteSliceActions.setSecuredAmount(1000),
    );
  });

  it('should call the generateQuote', async () => {
    useDispatchMock.mockImplementation(select =>
      select({
        ...storeMock,
        quote: {
          ...storeMock.quote,
          coverageData: {
            startDate: parseDateToString(
              new Date('Fri May 27 2022 17:52:38 GMT-0300 (GMT-03:00)'),
            ),
            endDate: parseDateToString(
              new Date('Fri May 27 2023 17:52:38 GMT-0300 (GMT-03:00)'),
            ),
            durationInDays: 365,
            securedAmount: 1000,
          },
        },
      }),
    );
    useAppDispatchMock.mockImplementation(() => mockDispatch);
    jest
      .spyOn(CoverageApi, 'getLimitCoverage')
      .mockImplementation(() => Promise.resolve(policyholderLimitMock));

    const { getByTestId } = render(<CoverageData />);

    const securedAmountInput = getByTestId('secured-amount');

    await act(async () => {
      fireEvent.focus(securedAmountInput);
      fireEvent.blur(securedAmountInput);
    });
  });
});
