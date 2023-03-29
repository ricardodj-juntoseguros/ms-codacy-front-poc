import { thousandSeparator, thousandTextFormatter } from '@shared/utils';
import { FilesCircleIllustration } from '@shared/ui';
import { ModalityEnum } from '../../../application/types/model';
import { getLabelByModality } from '../../../helpers';
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
        label: `Importância segurada${
          modality === ModalityEnum.LABOR ? ' aproximada' : ''
        }`,
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
        <FilesCircleIllustration />
        <h2 className={styles['modality-summary__no-ops-title']}>
          Não há oportunidades {getLabelByModality(modality, '', true)} ativas
        </h2>
        <p className={styles['modality-summary__no-ops-text']}>
          Até o momento não foram encontradas oportunidades ativas na modalidade{' '}
          {getLabelByModality(modality)} para o(s) tomador(es) selecionado(s).
          Caso existam oportunidades expiradas, elas estarão listadas abaixo.
        </p>
        <p className={styles['modality-summary__no-ops-text']}>
          Você pode solicitar a qualquer momento, por meio do seu comercial
          responsável, um mapeamento para que o Fidelize faça uma nova busca.
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
