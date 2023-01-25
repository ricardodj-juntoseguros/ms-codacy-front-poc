import { Alert, Button } from 'junto-design-system';
import { nanoid } from 'nanoid/non-secure';
import classNames from 'classnames';
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
  validPolicyholder: 'OK' | 'LOADING' | 'INVALID' | 'ERROR';
  onSubmit: () => void;
  renderError: () => JSX.Element | null;
}

const OpportunityDetailsModalConfirm: React.FC<OpportunityDetailsModalConfirmProps> =
  ({
    modality,
    opportunities,
    isSubmitting,
    validPolicyholder,
    onSubmit,
    renderError,
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
        economicGroup,
      } = opportunities[0];
      return [
        {
          label: 'Tomador/Grupo',
          value: `${policyholder}${
            economicGroup !== null ? ` - ${economicGroup}` : ''
          }`,
        },
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

    const getSubmitButtonLabel = () =>
      validPolicyholder === 'OK' ? 'Solicitar detalhes' : 'Tenho interesse';

    const getPolicyholderValidationAlertContent = (validStatus: string) => {
      const data: {
        [key: string]: { text: string; icon: string; variant: string };
      } = {
        LOADING: {
          text: 'Verificando situação do tomador...',
          icon: 'loading',
          variant: 'info',
        },
        INVALID: {
          text: 'Limite insuficiente para a oportunidade. Mesmo assim você pode demostrar interesse que encaminharemos ao time Comercial.',
          icon: 'alert-triangle',
          variant: 'warning',
        },
        ERROR: {
          text: 'Opa! Ocorreu um erro inesperado ao verificar a situação do tomador. Tente novamente mais tarde.',
          icon: 'x-circle',
          variant: 'error',
        },
      };
      return data[validStatus];
    };

    const renderPolicyholderValidation = () => {
      if (validPolicyholder === 'OK') return null;
      const { text, variant, icon } =
        getPolicyholderValidationAlertContent(validPolicyholder);
      return (
        <div
          className={classNames(
            styles['opportunity-details-modal-confirm__policyholder-feedback'],
            styles[
              `opportunity-details-modal-confirm__policyholder-feedback--${validPolicyholder.toLowerCase()}`
            ],
          )}
        >
          <Alert text={text} variant={variant as any} icon={icon} />
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
            {renderPolicyholderValidation()}
          </>
        )}
        {validPolicyholder !== 'ERROR' && validPolicyholder !== 'LOADING' && (
          <div className={styles['opportunity-details-modal-confirm__submit']}>
            {renderError()}
            <Button
              data-testid="submit-more-details"
              onClick={() => onSubmit()}
              mobileFullWidth
            >
              {isSubmitting
                ? ((<i className="icon icon-loading" />) as any)
                : getSubmitButtonLabel()}
            </Button>
          </div>
        )}
      </>
    );
  };

export default OpportunityDetailsModalConfirm;
