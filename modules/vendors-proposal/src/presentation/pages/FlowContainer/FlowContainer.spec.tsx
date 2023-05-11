import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import FlowContainer from './FlowContainer';

describe('ImportContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FlowContainer />);
    expect(baseElement).toBeTruthy();
  });
});
