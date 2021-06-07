import { render } from '@testing-library/react';

import { TimeframeAndCoverage } from './TimeframeAndCoverage';

describe('TimeframeAndCoverage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TimeframeAndCoverage />);
    expect(baseElement).toBeTruthy();
  });
});
