import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { RateSummary, RateSummaryProps } from './RateSummary';

describe('RateFlexCalculation.spec', () => {
  const handleDownloadQuote = jest.fn();

  let propsMock: RateSummaryProps = {} as RateSummaryProps;

  beforeEach(() => {
    propsMock = {
      handleDownloadQuote,
      finalPrize: 200.0,
      finalCommission: 20.0,
      commissionPercent: 10,
    };
  });

  it('should render successfully with the default properties', () => {
    const { baseElement } = render(<RateSummary {...propsMock} />);
    expect(baseElement).toBeInTheDocument();
  });

  it('should call a handleDownloadQuote when clicked', () => {
    const { getByRole } = render(<RateSummary {...propsMock} />);

    const button = getByRole('button');
    fireEvent.click(button);

    expect(handleDownloadQuote).toHaveBeenCalledTimes(1);
  });
});
