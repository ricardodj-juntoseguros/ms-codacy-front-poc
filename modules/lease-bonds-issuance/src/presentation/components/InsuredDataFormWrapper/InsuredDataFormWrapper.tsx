import { FunctionComponent } from 'react';
import { useProposal } from '../../hooks';
import styles from './InsuredDataFormWrapper.module.scss';

interface InsuredDataFormWrapperProps {
  name: string;
}

const InsuredDataFormWrapper: FunctionComponent<InsuredDataFormWrapperProps> =
  ({ children, name }) => {
    const updateProposal = useProposal();

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      updateProposal(name);
    };

    return (
      <form
        id="insuredDataForm-form"
        data-testid="insuredDataForm-form"
        className={styles['insured-data-form__wrapper']}
        onSubmit={e => handleSubmit(e)}
      >
        {children}
      </form>
    );
  };

export default InsuredDataFormWrapper;
