import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import ContractInfo from './ContractInfo';

describe('ContractInfo', () => {
  it('Should render correctly', () => {
    const { container } = render(
      <ContractInfo number={123} securedAmount={1000} />,
    );

    expect(container).toBeInTheDocument();
    expect.objectContaining({
      number: 123,
      securedAmount: 1000.0,
    });
  });
});
