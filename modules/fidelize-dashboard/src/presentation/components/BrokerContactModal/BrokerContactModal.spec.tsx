import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import BrokerContactApi from 'modules/fidelize-dashboard/src/application/features/brokerContact/BrokerContactApi';
import { act } from 'react-dom/test-utils';
import BrokerContactModal from './BrokerContactModal';

describe('BrokerContactModal', () => {
  it('Should call api on form filled correctly and submit click', async () => {
    jest
      .spyOn(BrokerContactApi, 'sendBrokerContactLead')
      .mockImplementationOnce(async () => {
        return 'Ok';
      });
    const { getByTestId, findByText } = render(
      <BrokerContactModal isOpen onCloseModal={jest.fn()} />,
    );

    fireEvent.change(getByTestId('input-contact-email'), {
      target: { value: 'teste@juntoseguros.com' },
    });
    fireEvent.change(getByTestId('input-contact-question'), {
      target: { value: 'test question' },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit-btn'));
    });

    waitFor(async () => {
      expect(await findByText('Contato solicitado!')).toBeInTheDocument();
      expect(BrokerContactApi.sendBrokerContactLead).toHaveBeenCalledWith(
        'teste@juntoseguros.com',
        'test question',
      );
    });
  });

  it('Should call onCloseModal callback on modal close button click', () => {
    const mockClose = jest.fn();
    const { getByTestId } = render(
      <BrokerContactModal isOpen onCloseModal={mockClose} />,
    );
    fireEvent.click(getByTestId('modal-close-button'));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
