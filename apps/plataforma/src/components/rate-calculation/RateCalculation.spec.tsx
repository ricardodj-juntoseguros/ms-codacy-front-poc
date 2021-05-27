import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';


import { RateCalculation, RateCalculationProps } from './RateCalculation';


describe('RateCalculation', () => {
  const handleDownloadQuote = jest.fn();
  const handleChangeStandardRate = jest.fn();

  let mockProps = {} as RateCalculationProps;

  beforeEach(() => {
    mockProps = {
      maxRate: '12',
      finalPrize: '200,00',
      finalCommission: '20.00',
      comissionPercent: '10',
      standardRateValue: 0,
      handleChangeStandardRate,
      handleDownloadQuote
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
    fireEvent.change(input, { target: { value: 123}});

    expect(handleChangeStandardRate).toHaveBeenCalledWith(123)
  });
});
