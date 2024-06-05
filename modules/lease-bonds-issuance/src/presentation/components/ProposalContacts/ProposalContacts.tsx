import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { LinkButton } from 'junto-design-system';
import ContactInputList from '../ContactInputList';
import {
  selectProposal,
  proposalActions,
} from '../../../application/features/proposal/ProposalSlice';
import styles from './ProposalContacts.module.scss';

const ProposalContacts: React.FC = () => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const { contacts } = useSelector(selectProposal);
  const { setContacts } = proposalActions;

  return (
    <div className={styles['proposal_contacts__wrapper']}>
      <div
        className={classNames(styles['proposal_contacts__title-wrapper'], {
          [styles['proposal_contacts__title-wrapper--expanded']]: expanded,
        })}
      >
        <h3 className={styles['proposal_contacts__title']}>
          Envio da apólice por e-mail (opcional)
        </h3>
        <LinkButton
          id="proposalContacts-toggle-button"
          data-testid="proposalContacts-toggle-button"
          icon="chevron-down"
          onClick={() => setExpanded(!expanded)}
          label=""
          title={expanded ? 'Recolher' : 'Expandir'}
        />
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ maxHeight: 0 }}
            animate={{ maxHeight: 350 }}
            exit={{ maxHeight: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={styles['proposal_contacts__content-wrapper']}
          >
            <p className={styles['proposal_contacts__content-label']}>
              Agilize o envio da apólice para o tomador adicionando o e-mail de
              quem irá receber após a emissão.
            </p>
            <ContactInputList
              idPrefix="proposalContacts"
              inputLabel="Adicionar e-mail de recebimento"
              contacts={contacts}
              onChangeContacts={value => dispatch(setContacts(value))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalContacts;
