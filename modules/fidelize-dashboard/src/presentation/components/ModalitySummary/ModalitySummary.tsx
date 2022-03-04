import { thousandSeparator, thousandTextFormatter } from '@shared/utils';
import { ModalityEnum } from '../../../application/types/model';
import styles from './ModalitySummary.module.scss';

interface ModalitySummaryProps {
  modality: ModalityEnum;
  totalOpportunities: number;
  totalInsuredValue: number;
}

const ModalitySummary: React.FC<ModalitySummaryProps> = ({
  modality,
  totalInsuredValue,
  totalOpportunities,
}) => {
  const getLabelByModality = () => {
    const base = 'Op. ';
    if (modality === ModalityEnum.FISCAL) return `${base} fiscais`;
    if (modality === ModalityEnum.CIVIL) return `${base} cíveis`;
    return `${base} trabalhistas`;
  };

  const renderItems = () => {
    const data = [
      {
        key: 'opportunities',
        icon: 'file',
        label: getLabelByModality(),
        value: thousandSeparator(totalOpportunities, '.'),
      },
      {
        key: 'is',
        icon: 'dollar-sign',
        label: 'Importância segurada',
        value: thousandTextFormatter(totalInsuredValue, 'R$ '),
      },
    ];

    return data.map(item => (
      <div
        key={`summary-item-${item.key}`}
        className={styles['modality-summary__item']}
      >
        <div className={styles['modality-summary__item-icon']}>
          <i className={`icon icon-${item.icon}`} />
        </div>
        <div className={styles['modality-summary__item-content']}>
          <p className={styles['modality-summary__item-content-label']}>
            {item.label}
          </p>
          <p className={styles['modality-summary__item-content-value']}>
            {item.value}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles['modality-summary__wrapper']}>{renderItems()}</div>
  );
};

export default ModalitySummary;
