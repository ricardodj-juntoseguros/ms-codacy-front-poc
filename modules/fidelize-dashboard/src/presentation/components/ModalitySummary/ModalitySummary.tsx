import { thousandSeparator, thousandTextFormatter } from '@shared/utils';
import { ModalityEnum } from '../../../application/types/model';
import { getLabelByModality } from '../../../helpers';
import { ReactComponent as NoOpportunitiesIllustration } from './assets/no-opportunities.svg';
import styles from './ModalitySummary.module.scss';

interface ModalitySummaryProps {
  modality: ModalityEnum;
  totalOpportunities: number;
  totalInsuredValue: number;
  hasError: boolean;
}

const ModalitySummary: React.FC<ModalitySummaryProps> = ({
  modality,
  totalInsuredValue,
  totalOpportunities,
  hasError,
}) => {
  const renderItems = () => {
    const data = [
      {
        key: 'opportunities',
        icon: 'file',
        label: getLabelByModality(modality, 'Op.', true),
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

  const renderNoOpportunitiesFound = () => {
    return (
      <div className={styles['modality-summary__no-ops-wrapper']}>
        <NoOpportunitiesIllustration
          className={styles['modality-summary__no-ops-illustration']}
        />
        <h2 className={styles['modality-summary__no-ops-title']}>
          Não há oportunidades {getLabelByModality(modality, '', true)}
        </h2>
        <p className={styles['modality-summary__no-ops-text']}>
          Até o momento não foram encontradas oportunidades no âmbito{' '}
          {getLabelByModality(modality)} para o(s) tomador(es) selecionado(s).
        </p>
        <p className={styles['modality-summary__no-ops-text']}>
          Caso você tenha solicitado o mapeamento recentemente, o retorno pode
          demorar aproximadamente 15 dias. Se não, você pode solicitar um novo
          mapeamento, por meio do seu comercial responsável.
        </p>
      </div>
    );
  };

  return (
    <div className={styles['modality-summary__wrapper']}>
      {hasError && (
        <h2 className={styles['modality-summary__error']}>
          Opa! Ocorreu um erro inesperado ao carregar esta seção. Por favor,
          tente novamente.
        </h2>
      )}
      {!hasError &&
        (totalOpportunities === 0
          ? renderNoOpportunitiesFound()
          : renderItems())}
    </div>
  );
};

export default ModalitySummary;
