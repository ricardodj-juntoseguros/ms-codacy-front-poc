/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { LinkButton } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { renderMappingEditionLossModal } from '../../../helpers/renderMappingEditionLossModal';
import styles from './MappingRequestsListitemMenu.module.scss';
import {
  selectModalEdition,
  setEditorId,
} from '../../../application/features/modalMapping/ModalMappingSlice';
import DeleteMappingRequestItem from '../DeleteMappingRequestItem/DeleteMappingRequestItem';

interface MappingRequestsListitemMenuProps {
  mappingId: number;
  policyholderName: string;
  canEdit?: boolean;
  onChangeCallback: () => void;
}

const MappingRequestsListitemMenu: React.FC<MappingRequestsListitemMenuProps> =
  ({ mappingId, policyholderName, canEdit, onChangeCallback }) => {
    const dispatch = useDispatch();
    const { editorId } = useSelector(selectModalEdition);
    const [showMenu, setShowMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const editionLossModalRef = useRef<HTMLDivElement>(null);

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

    const handleCheckOnEdit = (option: string, pos: number) => {
      switch (option) {
        case 'edit':
          if (!editorId) {
            setShowMenu(false);
            dispatch(setEditorId({ edit: mappingId, scroll: pos }));
            break;
          }

          renderMappingEditionLossModal(
            editionLossModalRef.current,
            () => {
              dispatch(setEditorId({ edit: mappingId, scroll: pos }));
            },
            true,
          );
          break;

        case 'remove':
          if (editorId === 0) {
            setShowMenu(false);
            setIsOpen(true);
            break;
          }
          renderMappingEditionLossModal(
            editionLossModalRef.current,
            () => {
              setIsOpen(true);
            },
            true,
          );

          break;

        default:
          break;
      }
    };

    return (
      <>
        <div ref={editionLossModalRef} />
        {isOpen && (
          <DeleteMappingRequestItem
            mappingId={mappingId}
            policyholderName={policyholderName}
            onChangeCallback={onChangeCallback}
          />
        )}

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
