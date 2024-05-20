import '@testing-library/jest-dom';
import { addDays, format, startOfDay, subDays, subYears } from 'date-fns';
import { parseDateToString } from '../../../helpers';
import { fireEvent, getByTestId, render } from '../../../config/testUtils';
import ValidityFields from './ValidityFields';
import { store } from '../../../config/store';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { modalityBidderMock, modalityDefaultMock } from '../../../__mocks__';

const todayFormatted = parseDateToString(startOfDay(new Date()));
const getStartInput = (container: HTMLElement) =>
  getByTestId(container, 'validityFields-dateinput-start-validity');
const getEndInput = (container: HTMLElement) =>
  getByTestId(container, 'validityFields-dateinput-end-validity');
const getDurationInput = (container: HTMLElement) =>
  getByTestId(container, 'validityFields-input-validity-days');

describe('ValidityFields', () => {
  afterEach(() => {
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('Should fill both validity dates with valid dates and calculate duration in days', () => {
    const { container } = render(<ValidityFields />);
    const startInput = getStartInput(container);
    const endInput = getEndInput(container);

    fireEvent.change(startInput, {
      target: { value: todayFormatted },
    });
    fireEvent.change(endInput, {
      target: { value: parseDateToString(startOfDay(addDays(new Date(), 30))) },
    });

    expect(Object.keys(store.getState().validation.errors)).toHaveLength(0);
    expect(getDurationInput(container)).toHaveValue('30 dias');
  });

  it('Should calculate end validity date automatically with start date and duration filled', () => {
    const { container } = render(<ValidityFields />);
    const startInput = getStartInput(container);
    const durationInput = getDurationInput(container);

    fireEvent.change(startInput, {
      target: { value: todayFormatted },
    });
    fireEvent.change(durationInput, {
      target: { value: '100' },
    });

    expect(getEndInput(container)).toHaveValue(
      format(startOfDay(addDays(new Date(), 100)), 'dd/MM/yyyy'),
    );
  });

  it('Should display error message if start date validity is before retroactive limit with variant retroactivity modalities', () => {
    store.dispatch(quoteSliceActions.setModality(modalityBidderMock));
    const { container, getByText } = render(<ValidityFields />);
    const startInput = getStartInput(container);

    fireEvent.change(startInput, {
      // Bidder is one day retroactive
      target: {
        value: format(startOfDay(subDays(new Date(), 5)), 'dd/MM/yyyy'),
      },
    });

    expect(
      getByText('A data de início da vigência ultrapassa o limite retroativo'),
    ).toBeInTheDocument();
  });

  it('Should display error message if start date validity is before retroactive limit with default retroactivity modalities', () => {
    store.dispatch(quoteSliceActions.setModality(modalityDefaultMock));
    const { container, getByText } = render(<ValidityFields />);
    const startInput = getStartInput(container);

    fireEvent.change(startInput, {
      // default is three years retroactive
      target: {
        value: format(startOfDay(subYears(new Date(), 4)), 'dd/MM/yyyy'),
      },
    });

    expect(
      getByText('A data de início da vigência ultrapassa o limite retroativo'),
    ).toBeInTheDocument();
  });

  it('Should display error message if start date validity is after end date validity', () => {
    const { container, getByText } = render(<ValidityFields />);
    const startInput = getStartInput(container);
    const endInput = getEndInput(container);

    fireEvent.change(startInput, {
      target: {
        value: format(startOfDay(addDays(new Date(), 5)), 'dd/MM/yyyy'),
      },
    });
    fireEvent.change(endInput, {
      target: {
        value: format(startOfDay(addDays(new Date(), 2)), 'dd/MM/yyyy'),
      },
    });

    expect(
      getByText('Data final menor ou igual a data inicial'),
    ).toBeInTheDocument();
  });

  it('Should display error message if end date validity is set to today', () => {
    store.dispatch(quoteSliceActions.setModality(modalityDefaultMock));
    store.dispatch(quoteSliceActions.setStartDateValidity(todayFormatted));
    const { container, getByText } = render(<ValidityFields />);
    const startInput = getStartInput(container);
    const endInput = getEndInput(container);
    fireEvent.change(startInput, {
      target: {
        value: format(startOfDay(subDays(new Date(), 7)), 'dd/MM/yyyy'),
      },
    });
    fireEvent.change(endInput, {
      target: {
        value: todayFormatted,
      },
    });
    expect(
      getByText('Data final deve ser após o dia de hoje'),
    ).toBeInTheDocument();
  });
});
