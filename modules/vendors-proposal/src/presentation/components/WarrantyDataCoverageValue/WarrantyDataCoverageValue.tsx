import className from 'classnames';
import { memo, useContext, useMemo } from 'react';
import { ThemeContext } from 'junto-design-system';

import styles from './WarrantyDataCoverageValue.module.scss';

export interface WarrantyDataCoverageValueProps {
  contractValue: number;
  warrantyPercentage: number;
}

const WarrantyDataCoverageValue: React.FunctionComponent<WarrantyDataCoverageValueProps> =
  ({ contractValue, warrantyPercentage }) => {
    const theme = useContext(ThemeContext);
    const value = useMemo(
      () =>
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format((contractValue / 100) * warrantyPercentage),
      [contractValue, warrantyPercentage],
    );

    return (
      <div className={styles['warranty-data-coverage-value__wrapper']}>
        <p
          className={className(
            styles['warranty-data-coverage-value__label'],
            styles[theme],
          )}
        >
          Valor que o seguro irá garantir
        </p>
        <p
          className={className(
            styles['warranty-data-coverage-value__total'],
            styles[theme],
          )}
        >
          {value}
        </p>
      </div>
    );
  };

export default memo(WarrantyDataCoverageValue);
