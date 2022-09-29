import { Button } from 'junto-design-system';
import { nanoid } from 'nanoid';
import { thousandSeparator } from '@shared/utils';
import { formatDateString, getLabelByModality } from '../../../helpers';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import {
  ModalityEnum,
  OpportunityDetailsCategoryEnum,
} from '../../../application/types/model';
import styles from './OpportunityDetailsModalConfirm.module.scss';

interface OpportunityDetailsModalConfirmProps {
  modality: ModalityEnum;
  opportunities: OpportunityDetailsItemDTO[];
  isSubmitting: boolean;
  onSubmit: () => void;
  renderError: () => JSX.Element | null;
  renderDisclaimer: () => JSX.Element;
}

const OpportunityDetailsModalConfirm: React.FC<OpportunityDetailsModalConfirmProps> =
  ({
    modality,
    opportunities,
    isSubmitting,
    onSubmit,
    renderError,
    renderDisclaimer,
  }) => {
    const getDataToRender = () => {
      const {
        category,
        policyholder,
        securityAmount,
        observation,
        mappingDate,
        relevance,
        expired,
      } = opportunities[0];
      return [
        { label: 'Tomador', value: policyholder },
        {
          label: 'Tipo/Obs',
          value: `${category} ${
            observation !== null ? `- ${observation}` : ''
          }`,
        },
        {
          label: `Importância segurada${
            category === OpportunityDetailsCategoryEnum.NEW_ISSUE &&
            securityAmount !== null
              ? ' aproximada'
              : ''
          }`,
          value:
            securityAmount !== null
              ? `R$ ${thousandSeparator(securityAmount, '.', 2)}`
              : 'Valor a definir',
        },
        {
          label: 'Data do mapeamento',
          value: formatDateString(mappingDate, 'dd/MMM/yy'),
        },
        {
          label: 'Relevância',
          value: expired ? 'Expirada' : relevance,
        },
      ];
    };

    const renderOpportunityData = () => {
      return (
        <div className={styles['opportunity-details-modal-confirm__data']}>
          {getDataToRender().map(item => (
            <div key={`data-item-${nanoid(3)}`}>
              <p
                className={
                  styles['opportunity-details-modal-confirm__data-label']
                }
              >
                {item.label}:
              </p>
              <p
                className={
                  styles['opportunity-details-modal-confirm__data-value']
                }
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      );
    };

    return (
      <>
        {opportunities.length === 1 && (
          <>
            <p className={styles['opportunity-details-modal-confirm__title']}>
              Oportunidade {getLabelByModality(modality)} selecionada:
            </p>
            {renderOpportunityData()}
          </>
        )}
        <div className={styles['opportunity-details-modal-confirm__submit']}>
          {renderError()}
          <Button
            data-testid="submit-more-details"
            onClick={() => onSubmit()}
            mobileFullWidth
          >
            {isSubmitting
              ? ((<i className="icon icon-loading" />) as any)
              : 'Solicitar detalhes'}
          </Button>
        </div>
        {renderDisclaimer()}
      </>
    );
  };

export default OpportunityDetailsModalConfirm;
