import React, { useContext } from 'react';
import classNames from 'classnames';
import { ThemeContext } from 'junto-design-system';
import styles from './ItemDetail.module.scss';



interface ItemDetailProps {
  label: string;
  value: string | number;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ label, value }) => {
  const theme = useContext(ThemeContext);

  return (
    <div className={styles['item-detail__wrapper']}>
      <span className={classNames(styles['item-detail__label'], styles[theme])}>
        {label}
      </span>
      <span className={classNames(styles['item-detail__value'], styles[theme])}>
        {value}
      </span>
    </div>
  );
};

export default ItemDetail;
