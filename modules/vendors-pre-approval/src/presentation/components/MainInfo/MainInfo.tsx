import React from 'react';
import { Divider } from 'junto-design-system';
import { currencyFormatter } from '@shared/utils';
import styles from './MainInfo.module.scss';

import ItemDetail from '../ItemDetail';

interface MainInfoProps {
  policyholder: string;
  modality: string;
  totalPremiumValue: number;
  duration: number;
  durationStart: string;
  durationEnd: string;
}

const MainInfo: React.FC<MainInfoProps> = ({
  policyholder,
  modality,
  totalPremiumValue,
  duration,
  durationStart,
  durationEnd,
}) => {
  return (
    <div className={styles['main-info__wrapper']}>
      <ItemDetail label="Empresa contratante" value={policyholder} />
      <ItemDetail label="Tipo de seguro garantia" value={modality} />
      <Divider size="100%" />
      <div className={styles['main-info__skeleton']}>
        <ItemDetail
          label="Valor total garantido"
          value={currencyFormatter(totalPremiumValue)}
        />
        <ItemDetail label="Tempo de vigência do seguro" value={duration} />
        <ItemDetail label="Inicio de Vigência" value={durationStart} />
        <ItemDetail label="Fim de vigência" value={durationEnd} />
      </div>
      <Divider size="100%" />
    </div>
  );
};

export default MainInfo;
