/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import { useState } from 'react';
import { Button, LinkButton, Modal } from 'junto-design-system';
import { AlertIllustration, SuccessIllustration } from '@shared/ui';
import styles from './MappingRequestsListitemMenu.module.scss';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';

interface MappingRequestsListitemMenuProps {
  mappingId: number;
  policyholderName: string;
  onRemoveCallback: () => void;
}

type ModalFlowStep = 'CONFIRM' | 'SUCCESS' | 'ONERROR';

const MappingRequestsListitemMenu: React.FC<MappingRequestsListitemMenuProps> =
  ({ mappingId, policyholderName, onRemoveCallback }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState<ModalFlowStep>('CONFIRM');

    const onCloseModal = () => {
      setIsOpen(false);
      if (currentStep === 'SUCCESS') {
        onRemoveCallback();
      }
    };

    const fetchDeleteMappingItem = () => {
      new ListingMappingApi()
        .deleteMappingItem(mappingId)
        .then(() => {
          setCurrentStep('SUCCESS');
        })
        .catch(() => {
          setCurrentStep('ONERROR');
        });
    };

    const getModalTemplate = () => {
      switch (currentStep) {
        case 'CONFIRM':
          return {
            title: {
              value: 'Tem certeza que deseja excluir esta solicitação?',
              align: 'center' as any,
              fontWeight: 'bold' as any,
            },
            text: {
              value: `Esta solicitação do tomador ${policyholderName} sairá da lista de mapeamento.`,
              align: 'center' as any,
            },
            buttons: {
              primary: (
                <Button
                  data-testid="confirm-exclusion-btn"
                  onClick={() => fetchDeleteMappingItem()}
                >
                  Excluir solicitação
                </Button>
              ),
              secondary: (
                <Button
                  data-testid="cancel-exclusion-btn"
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
              value: 'Não foi possível excluir a solicitação',
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
                  data-testid="retry-exclusion-btn"
                  onClick={() => fetchDeleteMappingItem()}
                >
                  Tentar novamente
                </Button>
              ),
              secondary: (
                <Button
                  data-testid="cancel-exclusion-btn"
                  onClick={() => onCloseModal()}
                  variant="secondary"
                >
                  Continuar sem excluir
                </Button>
              ),
            },
            icon: <AlertIllustration />,
          };
        case 'SUCCESS':
          return {
            title: {
              value: 'Solicitação excluída!',
              align: 'center' as any,
              fontWeight: 'bold' as any,
            },
            text: {
              value:
                'Lembrando que você ainda pode solicitar mapeamento deste tomador em um próximo momento.',
              align: 'center' as any,
            },
            icon: <SuccessIllustration />,
          };
        default:
          return undefined;
      }
    };

    return (
      <>
        <Modal
          size="default"
          open={isOpen}
          template={getModalTemplate()}
          onBackdropClick={() => onCloseModal()}
          onCloseButtonClick={() => onCloseModal()}
        />
        <div className={styles['mapping-request-listitem-menu__wrapper']}>
          <LinkButton
            data-testid="show-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
            label=""
            icon="more-horizontal"
          />

          <div
            data-testid="list-menu"
            onMouseLeave={() => setShowMenu(false)}
            className={
              styles['mapping-request-listitem-menu-options__container']
            }
          >
            <ul
              className={classNames(
                styles['mapping-request-listitem-menu-options__wrapper'],
                {
                  [styles[
                    'mapping-request-listitem-menu-options__wrapper--open'
                  ]]: showMenu,
                },
              )}
            >
              <li className={styles['mapping-request-listitem-menu__option']}>
                <LinkButton
                  data-testid="edit-item-btn"
                  onClick={() => setShowMenu(false)}
                  label="Editar solicitação"
                  icon="edit"
                />
              </li>
              <li className={styles['mapping-request-listitem-menu__option']}>
                <LinkButton
                  data-testid="remove-item-btn"
                  onClick={() => {
                    setShowMenu(false);
                    setIsOpen(true);
                  }}
                  label="Excluir solicitação"
                  icon="trash"
                />
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  };

export default MappingRequestsListitemMenu;
