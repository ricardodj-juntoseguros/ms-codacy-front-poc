import className from 'classnames';
import { memo, useContext, useMemo } from 'react';
import { ThemeContext } from 'junto-design-system';
import { currencyFormatter } from '@shared/utils';

import styles from './WarrantyDataCoverageValue.module.scss';

export interface WarrantyDataCoverageValueProps {
  totalValue: number;
}

const WarrantyDataCoverageValue: React.FunctionComponent<WarrantyDataCoverageValueProps> =
  ({ totalValue }) => {
    const theme = useContext(ThemeContext);
    const totalValueFormatted = useMemo(
      () => currencyFormatter(totalValue),
      [totalValue],
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
          {totalValueFormatted}
        </p>
      </div>
    );
  };

export default memo(WarrantyDataCoverageValue);
