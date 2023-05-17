import { formatDateString, thousandSeparator } from '@shared/utils';
import classNames from 'classnames';
import { Button, Modal, Tooltip } from 'junto-design-system';
import { useRef, useState } from 'react';
import { AlertIllustration, SuccessIllustration } from '@shared/ui';
import { RequestMappingRecord } from '../../../application/types/dto';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import { QueueTypesEnum } from '../../../application/types/model';
import styles from './BlockedMappingRequestsListitem.module.scss';
import MappingRequestsListitemMenu from '../MappingRequestsListitemMenu/MappingRequestsListitemMenu';

interface BlockedMappingRequestsListitemProps {
  mappingRequest: RequestMappingRecord;
  onRemoveCallback: () => void;
}

type ModalFlowStep = 'CONFIRM' | 'SUCCESS' | 'ONERROR';

const BlockedMappingRequestsListitem: React.FC<BlockedMappingRequestsListitemProps> =
  ({ mappingRequest, onRemoveCallback }) => {
    const {
      id,
      createdAt,
      policyholderName,
      policyholderEconomicGroupName,
      brokerName,
      category,
      queueTypes,
      isPriority,
      blocks,
      canUnlock,
    } = mappingRequest;

    const blockDivRef = useRef<HTMLDivElement>(null);
    const sendButtonRef = useRef<HTMLButtonElement>(null);
    const [showBlocks, setShowBlocks] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState<ModalFlowStep>('CONFIRM');
    const blockedMessage =
      'Existem bloqueios nesta solicitação que a impedem de ser encaminhada para a fila de mapeamento.';

    const onCloseModal = () => {
      setIsOpen(false);
      if (currentStep === 'SUCCESS') {
        onRemoveCallback();
      }
    };

    const patchDeleteMappingItem = () => {
      new ListingMappingApi()
        .patchMappingItem(id)
        .then(() => {
          setCurrentStep('SUCCESS');
        })
        .catch(() => {
          setCurrentStep('ONERROR');
        });
    };

    const handleTextBlocks = (preText: boolean) => {
      let fullText = preText
        ? `Tomador impedido de ser mapeado pelo${
            blocks?.length > 1 ? 's' : ''
          } motivo${blocks?.length > 1 ? 's' : ''}: `
        : '';

      blocks?.forEach((block, index) => {
        fullText = `${fullText}\n${block.description}${
          index < blocks.length - 1 ? '; ' : '.'
        }`;
      });

      return fullText;
    };

    const renderQueueColumn = (queueType: QueueTypesEnum) => {
      const queueData = queueTypes.find(qType => qType.id === queueType);
      let hasRequestedQueue = false;
      let opportunityCount: number | null = null;
      if (queueData !== undefined) {
        hasRequestedQueue = queueData.requested;
        opportunityCount = queueData.quantity;

        // Don't show count for CARF and DA
        if (
          queueType === QueueTypesEnum.CARF ||
          queueType === QueueTypesEnum.ACTIVE_DEBT
        ) {
          opportunityCount = null;
        }
      }
      const opportunityCountString = thousandSeparator(opportunityCount) || '-';

      return (
        <div className={styles['blocked-mapping-requests-listitem__queue']}>
          <span
            className={classNames(
              styles['blocked-mapping-requests-listitem__queue-badge'],
              {
                [styles[
                  'blocked-mapping-requests-listitem__queue-badge--requested'
                ]]: hasRequestedQueue,
              },
            )}
            data-testid={`${id}-queue-${queueType}-${
              hasRequestedQueue ? 'requested' : 'not-requested'
            }`}
          />
          <p
            title={`${opportunityCountString}`}
            className={styles['blocked-mapping-requests-listitem__label']}
          >
            {opportunityCountString}
          </p>
        </div>
      );
    };

    const switchButtons = () => {
      return (
        <Button
          data-testid={canUnlock ? 'show-modal-btn' : 'show-tooltip-btn'}
          variant="secondary"
          ref={sendButtonRef}
          size="small"
          onClick={() => {
            canUnlock ? setIsOpen(true) : setShowMessage(true);
          }}
          onMouseLeave={() => (canUnlock ? '' : setShowMessage(false))}
        >
          Enviar para fila
        </Button>
      );
    };

    const getModalTemplate = () => {
      switch (currentStep) {
        case 'CONFIRM':
          return {
            title: {
              value:
                'Tem certeza de que deseja enviar esta solicitação para a fila de mapeamento?',
              align: 'center' as any,
              fontWeight: 'bold' as any,
            },
            text: {
              value: `O tomador ${policyholderName} precisou passar por análise pelo${
                blocks?.length > 1 ? 's' : ''
              } motivo${blocks?.length > 1 ? 's' : ''}: ${handleTextBlocks(
                false,
              )}`,
              align: 'center' as any,
            },
            buttons: {
              primary: (
                <Button
                  data-testid="confirm-unblock-btn"
                  onClick={() => patchDeleteMappingItem()}
                >
                  Confirmar e enviar
                </Button>
              ),
              secondary: (
                <Button
                  data-testid="cancel-unblock-btn"
                  onClick={() => onCloseModal()}
                  variant="secondary"
                >
                  Cancelar
                </Button>
              ),
            },
          };
        case 'ONERROR':
          return {
            title: {
              value: 'Não foi possível enviar a solicitação',
              align: 'center' as any,
              fontWeight: 'bold' as any,
            },
            text: {
              value:
                'No momento o sistema não conseguiu concluir a operação. Tente novamente em instantes.',
              align: 'center' as any,
            },

            buttons: {
              primary: (
                <Button
                  data-testid="retry-unblock-btn"
                  onClick={() => patchDeleteMappingItem()}
                >
                  Tentar novamente
                </Button>
              ),
              secondary: (
                <Button
                  data-testid="cancel-unblock-on-error-btn"
                  onClick={() => onCloseModal()}
                  variant="secondary"
                >
                  Cancelar
                </Button>
              ),
            },
            icon: <AlertIllustration />,
          };
        case 'SUCCESS':
          return {
            title: {
              value: 'Solicitação enviada!',
              align: 'center' as any,
              fontWeight: 'bold' as any,
            },
            text: {
              value: 'O tomador foi enviado para a fila de mapeamento.',
              align: 'center' as any,
            },
            icon: <SuccessIllustration />,
          };
        default:
          return undefined;
      }
    };

    return (
      <div className={styles['blocked-mapping-requests-listitem__wrapper']}>
        <div className={styles['blocked-mapping-requests-listitem__column']}>
          <p className={styles['blocked-mapping-requests-listitem__label']}>
            {formatDateString(createdAt, 'dd/MM/yy')}
          </p>
        </div>
        <div className={styles['blocked-mapping-requests-listitem__column']}>
          <p
            className={classNames(
              styles['blocked-mapping-requests-listitem__label'],
              styles['blocked-mapping-requests-listitem__label--emphasys'],
            )}
            title={policyholderName}
          >
            {policyholderName}
          </p>
          {!!policyholderEconomicGroupName && (
            <span
              className={
                styles['blocked-mapping-requests-listitem__label-helper']
              }
              title={policyholderEconomicGroupName}
            >
              {policyholderEconomicGroupName}
            </span>
          )}
        </div>
        <div className={styles['blocked-mapping-requests-listitem__column']}>
          <p
            className={styles['blocked-mapping-requests-listitem__label']}
            title={brokerName}
          >
            {brokerName}
          </p>
          <span
            className={
              styles['blocked-mapping-requests-listitem__label-helper']
            }
          >
            {category}
          </span>
        </div>
        <div className={styles['blocked-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.LABOR)}
        </div>
        <div className={styles['blocked-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.FEDERAL)}
        </div>
        <div className={styles['blocked-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.STATE)}
        </div>
        <div className={styles['blocked-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.CARF)}
        </div>
        <div className={styles['blocked-mapping-requests-listitem__column']}>
          {renderQueueColumn(QueueTypesEnum.ACTIVE_DEBT)}
        </div>
        <div className={styles['blocked-mapping-requests-listitem__column']}>
          <div
            className={styles['blocked-mapping-requests-listitem__statuses']}
          >
            {isPriority && (
              <span
                className={
                  styles['blocked-mapping-requests-listitem__priority-tag']
                }
              >
                Urgente
              </span>
            )}
          </div>
        </div>

        <div className={styles['blocked-mapping-requests-listitem__column']}>
          <div
            className={classNames(
              styles['blocked-mapping-requests-listitem-actions__wrapper'],
              {
                [styles[
                  'blocked-mapping-requests-listitem-actions__wrapper-cant-unblock'
                ]]: !canUnlock,
              },
            )}
          >
            {switchButtons()}
            {blocks?.length > 0 && (
              <div
                className={classNames(
                  styles[
                    'blocked-mapping-requests-listitem-actions__show-tooltip'
                  ],
                  {
                    [styles[
                      'blocked-mapping-requests-listitem-actions__show-tooltip--warn'
                    ]]: !canUnlock,
                  },
                )}
                ref={blockDivRef}
              >
                <i
                  data-testid="show-tooltip"
                  onMouseEnter={() => setShowBlocks(true)}
                  onMouseLeave={() => setShowBlocks(false)}
                  className="icon-alert-circle"
                />
              </div>
            )}

            <MappingRequestsListitemMenu
              policyholderName={policyholderName}
              mappingId={id}
              onRemoveCallback={() => onRemoveCallback()}
            />
          </div>
          <Modal
            size="default"
            open={isOpen}
            template={getModalTemplate()}
            onBackdropClick={() => onCloseModal()}
            onCloseButtonClick={() => onCloseModal()}
          />

          <Tooltip
            anchorRef={blockDivRef}
            text={handleTextBlocks(!canUnlock)}
            visible={showBlocks}
            position="top"
          />

          <Tooltip
            anchorRef={sendButtonRef}
            text={blockedMessage}
            visible={showMessage}
            position="top"
          />
        </div>
      </div>
    );
  };

export default BlockedMappingRequestsListitem;
