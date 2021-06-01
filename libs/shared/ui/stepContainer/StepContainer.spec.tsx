import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { StepContainer } from './StepContainer';

describe('StepContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <StepContainer stepNumber={1} title={<h2>StepContainer</h2>}>
        <p>StepContainer</p>
      </StepContainer>,
    );

    expect(baseElement).toBeInTheDocument();
  });

  it('should render correct or submitted step number', () => {
    const { getByText } = render(
      <StepContainer stepNumber={123} title={<h2>StepContainer</h2>}>
        <p>StepContainer</p>
      </StepContainer>,
    );

    expect(getByText('123')).toBeInTheDocument();
  });
});
