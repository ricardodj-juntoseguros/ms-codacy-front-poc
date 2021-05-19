import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { StepContainer } from './StepContainer';

describe('StepContainer', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <StepContainer stepNumber={1}>
        <h1>StepContainer</h1>
      </StepContainer>
    );

    expect(baseElement).toBeInTheDocument();
    expect(getByText('StepContainer')).toBeInTheDocument();
  });

  it('should render correct or submitted step number', () => {
    const { getByText } = render(
      <StepContainer stepNumber={123}>
        <h1>StepContainer</h1>
      </StepContainer>
    );

    expect(getByText('123')).toBeInTheDocument();
  })
});
