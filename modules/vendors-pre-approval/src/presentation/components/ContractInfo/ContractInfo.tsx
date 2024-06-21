import React from 'react';

import { currencyFormatter } from '@shared/utils';
import ItemDetail from '../ItemDetail';
import styles from './ContractInfo.module.scss';


interface ContractInfoProps {
  number: number;
  securedAmount: number;
}

const ContractInfo: React.FC<ContractInfoProps> = ({
  number,
  securedAmount,
}) => {
  return (
    <div className={styles['contract-info__wrapper']}>
      <ItemDetail label="N.° do contrato" value={number} />
      <ItemDetail
        label="Valor do contrato"
        value={currencyFormatter(securedAmount)}
      />
    </div>
  );
};

export default ContractInfo;
