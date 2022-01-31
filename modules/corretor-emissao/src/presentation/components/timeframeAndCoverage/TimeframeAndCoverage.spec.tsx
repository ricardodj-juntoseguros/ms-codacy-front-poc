import { render } from '@testing-library/react';

import {
  TimeframeAndCoverage,
  TimeframeAndCoverageProps,
} from './TimeframeAndCoverage';

describe('TimeframeAndCoverage', () => {
  const timeFramePropsMock = {} as TimeframeAndCoverageProps;
  const handleTimeframeStartChange = jest.fn();
  const handleTimeframeEndChange = jest.fn();
  const handleDurationInDaysChange = jest.fn();
  const handleCoverageValueChange = jest.fn();
  const validateDateRange = jest.fn();

  it('should render successfully', () => {
    const { baseElement } = render(
      <TimeframeAndCoverage {...timeFramePropsMock} />,
    );
    expect(baseElement).toBeTruthy();
  });
});
