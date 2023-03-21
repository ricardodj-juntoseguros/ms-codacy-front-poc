import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import ComponentsWrapper from './ComponentsWrapper';

describe('Components Wwrapper', () => {
  it('Should render component and children', () => {
    const { baseElement } = render(<ComponentsWrapper />);
    expect(baseElement).toBeInTheDocument();
    expect(baseElement.children).toHaveLength(1);
  });
});
