/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Button, LinkButton, Modal } from 'junto-design-system';
import { AlertIllustration, SuccessIllustration } from '@shared/ui';
import { useDispatch, useSelector } from 'react-redux';
import { renderMappingEditionLossModal } from '../../../helpers/renderMappingEditionLossModal';
import styles from './MappingRequestsListitemMenu.module.scss';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import {
  selectModalEdition,
  setEditorId,
} from '../../../application/features/modalMapping/ModalMappingSlice';

interface MappingRequestsListitemMenuProps {
  mappingId: number;
  policyholderName: string;
  canEdit?: boolean;
  onRemoveCallback: () => void;
}

type ModalFlowStep = 'CONFIRM' | 'SUCCESS' | 'ONERROR';

const MappingRequestsListitemMenu: React.FC<MappingRequestsListitemMenuProps> =
  ({ mappingId, policyholderName, canEdit, onRemoveCallback }) => {
    const dispatch = useDispatch();
    const { editorId } = useSelector(selectModalEdition);
    const [showMenu, setShowMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const editionLossModalRef = useRef<HTMLDivElement>(null);
    const [currentStep, setCurrentStep] = useState<ModalFlowStep>('CONFIRM');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (!wrapperRef || !wrapperRef.current || !btnRef || !btnRef.current)
        return;
      const hideContent = (event: MouseEvent) => {
        if (!wrapperRef?.current?.contains(event.target as Node)) {
          setShowMenu(false);
        }
      };
      document.addEventListener('mousedown', hideContent);
      /* eslint-disable-next-line consistent-return */
      return () => document.removeEventListener('mousedown', hideContent);
    }, [wrapperRef, btnRef, showMenu]);

    const onCloseModal = () => {
      setIsOpen(false);
      if (currentStep === 'SUCCESS') {
        dispatch(setEditorId([0]));
        onRemoveCallback();
      }
    };

    const handleCheckOnEdit = (option: string, pos: number) => {
      switch (option) {
        case 'edit':
          if (!editorId) {
            setShowMenu(false);
            dispatch(setEditorId([mappingId, pos]));
          } else if (editorId !== mappingId) {
            renderMappingEditionLossModal(
              editionLossModalRef.current,
              () => {
                dispatch(setEditorId([mappingId, pos]));
              },
              true,
            );
          }
          break;

        case 'remove':
          if (editorId === 0) {
            setShowMenu(false);
            setIsOpen(true);
          } else if (editorId !== mappingId) {
            renderMappingEditionLossModal(
              editionLossModalRef.current,
              () => {
                setIsOpen(true);
              },
              true,
            );
          }
          break;

        default:
          break;
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
              value: `Esta solicitação do tomador ${policyholderName} será removida da lista.`,
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
                'O tomador foi removido da lista, mas se houver entendimento de que ele possa ser mapeado num futuro próximo, você poderá fazer uma nova solicitação.',
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
        <div ref={editionLossModalRef} />
        <Modal
          size="default"
          open={isOpen}
          template={getModalTemplate()}
          onBackdropClick={() => onCloseModal()}
          onCloseButtonClick={() => onCloseModal()}
        />
        <div
          ref={wrapperRef}
          className={classNames(
            styles['mapping-request-listitem-menu__wrapper'],
            {
              [styles['mapping-request-listitem-menu__wrapper--open']]:
                showMenu,
            },
          )}
        >
          <LinkButton
            ref={btnRef}
            data-testid="show-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
            label=""
            icon="more-horizontal"
          />

          <div
            data-testid="list-menu"
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
              <li
                className={classNames(
                  styles['mapping-request-listitem-menu__option'],
                  {
                    [styles['mapping-request-listitem-menu__option--can-edit']]:
                      canEdit,
                  },
                )}
              >
                <LinkButton
                  data-testid="edit-item-btn"
                  onClick={e => {
                    canEdit && handleCheckOnEdit('edit', e.clientY);
                  }}
                  label="Editar solicitação"
                  icon="edit"
                />
              </li>
              <li className={styles['mapping-request-listitem-menu__option']}>
                <LinkButton
                  data-testid="remove-item-btn"
                  onClick={e => {
                    handleCheckOnEdit('remove', e.clientY);
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
