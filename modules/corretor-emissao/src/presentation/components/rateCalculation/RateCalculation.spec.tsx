import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { RateCalculation, RateCalculationProps } from './RateCalculation';

describe('RateCalculation', () => {
  const handleDownloadQuote = jest.fn();
  const handleChangeStandardRate = jest.fn();
  const handleEndEditing = jest.fn();
  let mockProps = {} as RateCalculationProps;

  it('Renders without crashing', () => {
    const { baseElement } = render(<RateCalculation {...mockProps} />);

    expect(baseElement).toBeTruthy();
  });

  beforeEach(() => {
    mockProps = {
      maxRate: 12,
      finalPrize: 200.0,
      finalCommission: 20.0,
      commissionPercent: 10,
      standardRateValue: 0,
      handleChangeStandardRate,
      handleDownloadQuote,
      errorMessage: '',
      handleEndEditing,
    };
  });

  it('should correctly render the values ​​charged in the props', () => {
    const { baseElement } = render(<RateCalculation {...mockProps} />);

    expect(baseElement).toBeInTheDocument();
  });

  it('should call a handleDownloadQuote when clicked', () => {
    const { getByRole } = render(<RateCalculation {...mockProps} />);

    const button = getByRole('button');
    fireEvent.click(button);

    expect(handleDownloadQuote).toHaveBeenCalledTimes(1);
  });

  it('should call a handleChangeStandardRate when clicked', () => {
    const { getByRole } = render(<RateCalculation {...mockProps} />);

    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 123 } });

    expect(handleChangeStandardRate).toHaveBeenCalledWith(123);
  });
});
