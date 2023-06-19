import { useEffect, useState, useMemo } from 'react';
import { Button, InputBase, makeToast } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { emailValidator } from '@shared/utils';
import { PolicyholderContactSchema } from '../../../application/validations/schemas';
import PolicyholderContactAPI from '../../../application/features/policyholderContact/PolicyholderContactAPI';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';
import {
  GenericComponentProps,
  ValidationTypesEnum,
} from '../../../application/types/model';
import { useValidate } from '../../hooks';

import styles from './PolicyholderContact.module.scss';

const PolicyholderContact: React.FunctionComponent<GenericComponentProps> = ({
  handleNextStep,
  updateTitle,
}) => {
  const { policyholderContact } = useSelector(selectProposal);
  const [disabledFields, setDisabledFields] = useState(
    !!policyholderContact.id,
  );
  const { errors } = useSelector(selectValidation);
  const dispatch = useDispatch();
  const validate = useValidate();

  const disabledButton = useMemo(
    () =>
      !policyholderContact.name || !emailValidator(policyholderContact.email),
    [policyholderContact],
  );

  useEffect(() => {
    const getContacts = () => {
      const query = window.location.search
        ? window.location.search.substring(11, window.location.search.length)
        : '91833813000118';
      PolicyholderContactAPI.getContacts(query)
        .then(response => {
          if (response.length >= 1) {
            dispatch(proposalActions.setPolicyholderContact(response[0]));
            setDisabledFields(true);
            updateTitle &&
              updateTitle(
                'Este será o %STRONG% Aquele que receberá a solicitação para aprovação.',
                ['contato da empresa contratada.'],
              );
          }
        })
        .catch(error => {
          makeToast('warning', error.data.data[0].message);
        });
    };

    if (!policyholderContact.name && !policyholderContact.email) getContacts();
  }, [dispatch, policyholderContact, updateTitle]);

  const handleContactName = (name: string) => {
    dispatch(
      proposalActions.setPolicyholderContact({ ...policyholderContact, name }),
    );
  };

  const handleContactEmail = (email: string) => {
    dispatch(
      proposalActions.setPolicyholderContact({ ...policyholderContact, email }),
    );
  };

  const validateFields = async (fieldName: string) => {
    await validate(
      PolicyholderContactSchema,
      policyholderContact,
      ValidationTypesEnum.partial,
      [fieldName],
      false,
    );
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = await validate(
      PolicyholderContactSchema,
      policyholderContact,
    );
    if (!result) return;

    handleNextStep(
      `${policyholderContact.name} - ${policyholderContact.email}`,
    );
  };

  return (
    <form
      className={styles['policyholder-contact__wrapper']}
      onSubmit={e => handleSubmit(e)}
    >
      <InputBase
        data-testid="policyholderContact-input-contact-name"
        label="Nome de um contato na empresa"
        placeholder=" "
        onChange={e => handleContactName(e.target.value)}
        value={policyholderContact.name}
        readOnly={disabledFields}
        errorMessage={errors.name ? errors.name[0] : ''}
      />
      <InputBase
        data-testid="policyholderContact-input-contact-email"
        label="E-mail de contato na empresa"
        placeholder=" "
        onChange={e => handleContactEmail(e.target.value)}
        onBlur={() => validateFields('email')}
        value={policyholderContact.email}
        readOnly={disabledFields}
        errorMessage={errors.email ? errors.email[0] : ''}
      />
      <Button
        data-testid="policyholderContact-button-next"
        type="submit"
        fullWidth
        disabled={disabledButton}
      >
        Avançar
      </Button>
    </form>
  );
};

export default PolicyholderContact;
