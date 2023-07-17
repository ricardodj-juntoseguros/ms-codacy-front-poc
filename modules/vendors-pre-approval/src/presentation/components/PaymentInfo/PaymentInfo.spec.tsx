import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import PaymentInfo from './PaymentInfo';

const PaymentInfoPropsMock = {
  numberOfInstallments: 1,
  installmentsPrize: 100.5,
  totalPrize: 100.5,
  firstDueDate: '2023-06-27T16:51:02.597Z',
};

describe('PaymentInfo', () => {
  it('Should render with correct props', () => {
    const { container } = render(<PaymentInfo {...PaymentInfoPropsMock} />);

    expect(container).toBeInTheDocument();
    expect.objectContaining(PaymentInfoPropsMock);
  });
});
