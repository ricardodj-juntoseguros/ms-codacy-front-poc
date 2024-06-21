import React, { Fragment, useContext } from 'react';

import classNames from 'classnames';
import { ThemeContext } from 'junto-design-system';
import { TicketIllustration } from '@shared/ui';
import { formatDateString, currencyFormatter } from '@shared/utils';
import styles from './PaymentInfo.module.scss';

import ItemDetail from '../ItemDetail';

interface PaymentInfoProps {
  numberOfInstallments: number;
  installmentsPrize: number;
  totalPrize: number;
  firstDueDate: string;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  numberOfInstallments,
  installmentsPrize,
  totalPrize,
  firstDueDate,
}) => {
  const theme = useContext(ThemeContext);

  return (
    <div className={styles['payment-info__wrapper']}>
      <div className={styles['payment-info__graybox']}>
        <TicketIllustration />
        <span>
          Primeiro boleto vence em <strong>{firstDueDate}</strong> e os próximos
          a cada 30 dias
        </span>
      </div>
      <div className={styles['payment-info__details']}>
        <ItemDetail
          label="Parcelas"
          value={`${numberOfInstallments}x ${currencyFormatter(
            installmentsPrize,
          )}`}
        />
        <ItemDetail label="Primeira parcela" value={firstDueDate} />
      </div>
      <div className={classNames(styles['payment-info__total'], styles[theme])}>
        <span>Total</span>
        <span>{currencyFormatter(totalPrize)}</span>
      </div>
    </div>
  );
};

export default PaymentInfo;
