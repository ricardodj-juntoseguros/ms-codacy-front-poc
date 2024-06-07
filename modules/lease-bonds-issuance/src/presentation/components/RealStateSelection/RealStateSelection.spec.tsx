import React from 'react';
import { render } from '../../../config/testUtils';
import RealStateSelection from './RealStateSelection';

it('renders RealStateSelection component correctly', () => {
  const { getByTestId } = render(<RealStateSelection />);
  const inputElement = getByTestId('real-state-selection-input-search');
  expect(inputElement).toBeDefined();
});
