import { render } from '@testing-library/react';

import {
  TimeframeAndCoverage,
  TimeframeAndCoverageProps,
} from './TimeframeAndCoverage';

describe('TimeframeAndCoverage', () => {
  let timeFramePropsMock = {} as TimeframeAndCoverageProps;
  const handleTimeframeStartChange = jest.fn();
  const handleTimeframeEndChange = jest.fn();
  const handleDurationInDaysChange = jest.fn();
  const handleCoverageValueChange = jest.fn();
  const validateDateRange = jest.fn();

  beforeEach(() => {
    timeFramePropsMock = {
      timeframeStart: new Date(),
      timeframeEnd: new Date(),
      durationInDays: 0,
      coverageValue: 0,
      policyholderLimit: 0,
      maxCoverageDays: 0,
      errorMessageDate: '',
      errorMessageCoverageDays: '',
      errorMessageCoverageAmount: '',
      handleTimeframeStartChange,
      handleTimeframeEndChange,
      handleDurationInDaysChange,
      handleCoverageValueChange,
      validateDateRange,
    };
  });
  it('should render successfully', () => {
    const { baseElement } = render(
      <TimeframeAndCoverage {...timeFramePropsMock} />,
    );
    expect(baseElement).toBeTruthy();
  });
});
