import { memo, useContext, useMemo } from 'react';
import { LinkButton, Modal, ThemeContext } from 'junto-design-system';
import { ChatUtils } from '@shared/utils';
import className from 'classnames';
import { nanoid } from '@reduxjs/toolkit';
import { ModalityModel } from '../../../application/types/model';
import { MODALITIES_INFORMATION } from '../../../constants';
import styles from './ModalitiesInformationModal.module.scss';

export interface ModalitiesInformationModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  modalityOptionsMapped: ModalityModel[];
}

const ModalitiesInformationModal: React.FunctionComponent<ModalitiesInformationModalProps> =
  ({ openModal, setOpenModal, modalityOptionsMapped }) => {
    const theme = useContext(ThemeContext);
    const modalitiesToShowInformation = useMemo(
      () => modalityOptionsMapped.map(modality => modality.modalityId),
      [modalityOptionsMapped],
    );

    const renderInformationList = () => {
      return modalitiesToShowInformation.map((modality, index) => {
        const information = MODALITIES_INFORMATION.find(
          info => info.modalityId === modality,
        );

        return (
          <li
            className={styles['modality-information-modal__item']}
            key={nanoid(5)}
          >
            <h3
              className={className(
                styles['modality-information-modal__item-title'],
                styles[theme],
              )}
            >
              {index + 1}. {information?.title}
            </h3>
            <p
              className={className(
                styles['modality-information-modal__item-text'],
                styles[theme],
              )}
            >
              {information?.text}
            </p>
          </li>
        );
      });
    };

    return (
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onBackdropClick={() => setOpenModal(false)}
        size="large"
      >
        <div
          className={className(
            styles['modality-information-modal__wrapper'],
            styles[theme],
          )}
        >
          <h2
            className={className(
              styles['modality-information-modal__title'],
              styles[theme],
            )}
          >
            Qual é a finalidade do contrato a ser garantido?
          </h2>

          <p
            className={className(
              styles['modality-information-modal__description'],
              styles[theme],
            )}
          >
            Se você chegou até aqui, está no caminho certo para contratar a
            garantia da execução de um contrato que foi ou será assinado pela
            sua empresa.
          </p>
          <p
            className={className(
              styles['modality-information-modal__description'],
              styles[theme],
            )}
          >
            Esta etapa é simples: precisamos saber qual é o objetivo do contrato
            para incluir essa informação na sua apólice de seguro garantia.
            Vamos analisar os detalhes de cada finalidade.
          </p>

          <ul className={styles['modality-information-modal__list']}>
            {renderInformationList()}
          </ul>
          <p
            className={className(
              styles[theme],
              styles['modality-information-modal__item-text'],
              styles['modality-information-modal__help-text'],
            )}
          >
            Ainda não tem certeza?
          </p>
          <LinkButton
            label="Clique aqui e converse com um especialista pelo chat."
            size="large"
            onClick={() => ChatUtils.zenDesk.open()}
          />
        </div>
      </Modal>
    );
  };

export default memo(ModalitiesInformationModal);
