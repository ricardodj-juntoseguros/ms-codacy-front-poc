import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { HeaderPages } from './HeaderPages';

describe('headerPages', () => {
  const historyMock = jest.fn();

  const props = {
    handleGoBackClick: {
      push: historyMock as any,
    } as any,
  };

  it('Should render without crashing', () => {
    const { getByTestId } = render(<HeaderPages {...props} />);

    expect(getByTestId('go-back-btn')).toBeInTheDocument();
  });
});
