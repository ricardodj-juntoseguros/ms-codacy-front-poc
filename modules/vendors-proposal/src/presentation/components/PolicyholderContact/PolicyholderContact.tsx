import { useEffect, useState, useMemo } from 'react';
import { Button, InputBase } from 'junto-design-system';
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
import PolicyholderContactSkeleton from '../Skeletons/PolicyholderContactSkeleton/PolicyholderContactSkeleton';

const PolicyholderContact: React.FunctionComponent<GenericComponentProps> = ({
  handleNextStep,
  updateTitle,
}) => {
  const { policyholderContact, policyholder } = useSelector(selectProposal);
  const { errors } = useSelector(selectValidation);
  const dispatch = useDispatch();
  const validate = useValidate();
  const [disabledFields, setDisabledFields] = useState(
    !!policyholderContact.id,
  );
  const [loading, setLoading] = useState(false);

  const disabledButton = useMemo(
    () =>
      !policyholderContact.name || !emailValidator(policyholderContact.email),
    [policyholderContact],
  );

  useEffect(() => {
    const fetchContacts = () => {
      if (
        !policyholder ||
        !policyholder.federalId ||
        policyholderContact.id.length !== 0 ||
        (policyholderContact.name && policyholderContact.email)
      )
        return;

      setLoading(true);
      PolicyholderContactAPI.getContacts(policyholder.federalId)
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
        .catch(() => {
          setDisabledFields(false);
        })
        .finally(() => setLoading(false));
    };

    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {loading ? (
        <PolicyholderContactSkeleton />
      ) : (
        <>
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
        </>
      )}
    </form>
  );
};

export default PolicyholderContact;
