import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Button, InputBase } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { GenericComponentProps, useFlow } from '@shared/hooks';
import { selectContractualCondition } from '../../../application/features/contractualCondition/ContractualConditionSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import InsuredSelection from '../InsuredSelection';
import { useProposal } from '../../hooks';

import styles from './InsuredDataForm.module.scss';
import ContractualCondition from '../ContractualCondition';
import ContractualConditionSkeleton from '../Skeletons/ContractualConditionSkeleton';
import ObjectPreviewModal from '../ObjectPreviewModal';

const InsuredDataForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { advanceStep } = useFlow();
  const updateProposal = useProposal();
  const {
    insured,
    insuredAddress,
    biddingNumber,
    biddingDescription,
    loadingProposal,
    identification,
    createProposalSuccess,
  } = useSelector(selectProposal);
  const { currentQuote, policyholder } = useSelector(selectQuote);
  const {
    loadingContractualCondition,
    openContractualConditions,
    text,
    requestedBy,
  } = useSelector(selectContractualCondition);
  const { setBiddingNumber, setBiddingDescription, setCreateProposalSuccess } =
    proposalActions;

  useEffect(() => {
    if (createProposalSuccess) {
      dispatch(setCreateProposalSuccess(false));
      // advanceStep(name);
    }
  }, [
    advanceStep,
    createProposalSuccess,
    dispatch,
    name,
    setCreateProposalSuccess,
  ]);

  const disabledSubmitButton = useMemo(() => {
    const hasDefaultFields =
      insured?.federalId &&
      insuredAddress?.addressId &&
      biddingNumber &&
      identification?.PolicyId;
    const hasContratualCondition = text && requestedBy;
    return (
      !hasDefaultFields ||
      (openContractualConditions && !hasContratualCondition)
    );
  }, [
    biddingNumber,
    identification?.PolicyId,
    insured,
    insuredAddress,
    openContractualConditions,
    requestedBy,
    text,
  ]);

  const disabledObjectPreviewButton = useMemo(
    () =>
      !identification?.PolicyId ||
      loadingProposal ||
      loadingContractualCondition,
    [identification?.PolicyId, loadingProposal, loadingContractualCondition],
  );

  const handleBiddingNumberChange = (biddingNumber: string) => {
    dispatch(setBiddingNumber(biddingNumber));
  };

  const handleBiddingDescriptionChange = (biddingDescription: string) => {
    dispatch(setBiddingDescription(biddingDescription));
  };

  const handleToggleModal = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    updateProposal();
  };

  const renderContractualCondition = () => {
    const disabledCustomClauses = policyholder?.disabledFeatures.customClauses;
    if (disabledCustomClauses) return null;
    if (loadingProposal) return <ContractualConditionSkeleton />;
    if (!identification?.PolicyId) return null;
    return <ContractualCondition />;
  };

  return (
    <form
      id="insuredDataForm-form"
      data-testid="insuredDataForm-form"
      className={styles['insured-data-form__wrapper']}
      onSubmit={e => handleSubmit(e)}
    >
      <InsuredSelection />
      <div className={styles['insured-data-form__bidding-data']}>
        <p className={styles['insured-data-form__description']}>
          Dados do edital
        </p>
        <div className={styles['insured-data-form__bidding-data-fields']}>
          <InputBase
            id="insuredDataForm-input-biddingNumber"
            data-testid="insuredDataForm-biddingNumber-input"
            label="Número do edital"
            placeholder="Digite o número do edital"
            value={biddingNumber}
            onChange={e => handleBiddingNumberChange(e.target.value)}
            onBlur={() => updateProposal()}
          />
          <InputBase
            id="insuredDataForm-biddingDescription-input"
            data-testid="insuredDataForm-biddingDescription-input"
            label="Número do anexo do edital (opcional)"
            placeholder="Digite o número do anexo do edital"
            value={biddingDescription}
            onChange={e => handleBiddingDescriptionChange(e.target.value)}
            onBlur={() => updateProposal()}
          />
        </div>
      </div>
      {renderContractualCondition()}
      <footer className={styles['insured-data-form__footer']}>
        <Button
          id="insuredDataForm-show-object-preview-button"
          data-testid="insuredDataForm-show-object-preview-button"
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => handleToggleModal(true)}
          disabled={disabledObjectPreviewButton}
        >
          Clique para visualizar o objeto
        </Button>
        <Button
          id="insuredDataForm-submit-button"
          data-testid="insuredDataForm-submit-button"
          type="submit"
          fullWidth
          disabled={disabledSubmitButton}
          loading={loadingProposal || loadingContractualCondition}
        >
          Continuar
        </Button>
      </footer>
      <ObjectPreviewModal
        isModalOpen={isModalOpen}
        onToggleModal={handleToggleModal}
      />
      <p className={styles['insured-data-form__numbers']}>
        <span>Cotação: {currentQuote?.identification.QuotationId}</span>
        <span>Novo cotador: {currentQuote?.identification.NewQuoterId}</span>
        <span>Proposta V3: {currentQuote?.identification.ProposalId}</span>
        <span>Número da proposta GV: {identification?.PolicyId}</span>
      </p>
    </form>
  );
};

export default InsuredDataForm;
