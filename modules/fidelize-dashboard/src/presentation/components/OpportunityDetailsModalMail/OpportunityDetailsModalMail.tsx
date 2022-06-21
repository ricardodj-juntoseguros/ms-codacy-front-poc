import { Button, InputBase } from 'junto-design-system';
import React, { useState } from 'react';
import { emailValidator } from '@shared/utils';
import styles from './OpportunityDetailsModalMail.module.scss';

interface OpportunityDetailsModalMailProps {
  isSubmitting: boolean;
  renderSubmitError: () => JSX.Element | null;
  onSubmit: (value: string) => void;
}

const OpportunityDetailsModalMail: React.FC<OpportunityDetailsModalMailProps> =
  ({ onSubmit, renderSubmitError, isSubmitting }) => {
    const [email, setEmail] = useState<string>('');
    const [validationError, setValidationError] = useState<boolean>();

    const isEmptyInput = () => !email || email.trim().length === 0;

    const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.target;
      setValidationError(false);
      setEmail(value);
    };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (isEmptyInput()) return;
      const isValid = emailValidator(email);
      setValidationError(!isValid);
      if (isValid) onSubmit(email.trim());
    };

    const getErrorMessage = () => {
      return validationError ? 'Digite um e-mail válido.' : undefined;
    };

    return (
      <div className={styles['opportunity-details-modal-mail__wrapper']}>
        <form onSubmit={e => handleSubmit(e)}>
          <InputBase
            type="email"
            data-testid="mail-input-more-details"
            label="Informe seu e-mail"
            placeholder="exemplo@email.com"
            errorMessage={getErrorMessage()}
            value={email}
            onChange={e => handleInputChange(e)}
          />
          {renderSubmitError()}
          <Button
            onClick={e => handleSubmit(e)}
            data-testid="submit-more-details-email"
            disabled={isEmptyInput()}
          >
            {isSubmitting
              ? ((<i className="icon icon-loading" />) as any)
              : 'Enviar'}
          </Button>
        </form>
      </div>
    );
  };

export default OpportunityDetailsModalMail;
