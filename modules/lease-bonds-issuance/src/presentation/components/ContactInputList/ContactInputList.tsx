import { FunctionComponent, useState } from 'react';
import { Button, InputBase, LinkButton } from 'junto-design-system';
import { emailValidator } from '@shared/utils';
import { nanoid } from '@reduxjs/toolkit';
import { VALIDATION_MESSAGES } from '../../../constants';
import styles from './ContactInputList.module.scss';

export interface ContactInputListProps {
  idPrefix: string;
  inputLabel: string;
  contacts: string[];
  onChangeContacts: (value: string[]) => void;
}

const ContactInputList: FunctionComponent<ContactInputListProps> = ({
  idPrefix,
  inputLabel,
  contacts,
  onChangeContacts,
}) => {
  const [contact, setContact] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSetContact = (value: string) => {
    setContact(value);
    setError('');
  };

  const handleRemoveContact = (value: string) => {
    const updatedContacts = contacts.filter(email => email !== value);
    onChangeContacts(updatedContacts);
  };

  const handleChangeContacts = () => {
    if (!emailValidator(contact)) {
      setError(VALIDATION_MESSAGES.invalidEmail);
      return;
    }
    const contactExists = contacts.find(item => item === contact);
    if (!contactExists) {
      onChangeContacts([...contacts, contact]);
    }
    setContact('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleChangeContacts();
    }
  };

  const renderContactList = () => {
    if (contacts.length === 0) return null;
    return (
      <ul className={styles['contact-input-list__contact-list']}>
        {contacts.map(contact => {
          return (
            <li
              key={nanoid(5)}
              className={styles['contact-input-list__contact-item']}
            >
              {contact}
              <LinkButton
                id={`${idPrefix}-link-button-remove-contact`}
                data-testid={`${idPrefix}-link-button-remove-contact`}
                label="Excluir"
                icon="trash"
                iconPosition="left"
                size="small"
                onClick={() => handleRemoveContact(contact)}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={styles['contact-input-list__wrapper']}>
      <div className={styles['contact-input-list__input-wrapper']}>
        <InputBase
          id={`${idPrefix}-input-contact`}
          data-testid={`${idPrefix}-input-contact`}
          label={inputLabel}
          placeholder="email@juntoseguros.com"
          value={contact}
          onChange={e => handleSetContact(e.target.value)}
          errorMessage={error}
          onKeyDown={e => handleKeyDown(e)}
        />
        <Button
          id={`${idPrefix}-button-add`}
          data-testid={`${idPrefix}-button-add`}
          variant="secondary"
          onClick={() => handleChangeContacts()}
        >
          Adicionar
        </Button>
      </div>
      {renderContactList()}
    </div>
  );
};

export default ContactInputList;
