import { Button } from 'junto-design-system';
import { nanoid } from 'nanoid';
import { thousandSeparator } from '@shared/utils';
import { getLabelByModality } from '../../../helpers';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import { ModalityEnum } from '../../../application/types/model';
import styles from './OpportunityDetailsModalConfirm.module.scss';

interface OpportunityDetailsModalConfirmProps {
  modality: ModalityEnum;
  opportunity: OpportunityDetailsItemDTO;
  isSubmitting: boolean;
  onSubmit: () => void;
  renderError: () => JSX.Element | null;
  renderDisclaimer: () => JSX.Element;
}

const OpportunityDetailsModalConfirm: React.FC<OpportunityDetailsModalConfirmProps> =
  ({
    modality,
    opportunity,
    isSubmitting,
    onSubmit,
    renderError,
    renderDisclaimer,
  }) => {
    const {
      category,
      policyholder,
      securityAmount,
      observation,
      mappingDate,
      relevance,
      expired,
    } = opportunity;

    const getDataToRender = () => {
      return [
        { label: 'Tomador', value: policyholder },
        {
          label: 'Tipo/Obs',
          value: `${category} ${
            observation !== null ? `- ${observation}` : ''
          }`,
        },
        {
          label: 'Importância segurada',
          value: `R$ ${thousandSeparator(securityAmount, '.', 2)}`,
        },
        { label: 'Data do mapeamento', value: mappingDate },
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
        <p className={styles['opportunity-details-modal-confirm__title']}>
          Oportunidade {getLabelByModality(modality)} selecionada:
        </p>
        {renderOpportunityData()}
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
