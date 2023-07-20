import { Button, LinkButton } from 'junto-design-system';
import styles from './ProposalSummaryAside.module.scss';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export interface ProposalSummaryAsideProps {
  handleSubmit: () => void;
  handleEdit: () => void;
  loading: boolean;
}

const ProposalSummaryAside: React.FC<ProposalSummaryAsideProps> = ({
  handleSubmit,
  handleEdit,
  loading,
}) => {
  return (
    <aside className={styles['proposal-summary-aside__actions']}>
      <Button
        fullWidth
        onClick={() => handleSubmit()}
        data-testid="proposalSummaryAside-button-submit"
      >
        {loading ? ((<LoadingSpinner />) as any) : 'Solicitar seguro garantia'}
      </Button>
      <LinkButton
        label="Editar solicitação"
        icon="edit"
        size="large"
        onClick={() => handleEdit()}
        data-testid="proposalSummaryAside-button-edit"
      />
    </aside>
  );
};

export default ProposalSummaryAside;
