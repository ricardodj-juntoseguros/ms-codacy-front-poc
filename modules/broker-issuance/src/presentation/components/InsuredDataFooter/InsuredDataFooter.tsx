/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useMemo, useState } from 'react';
import { Button } from 'junto-design-system';
import { useSelector } from 'react-redux';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectContractualCondition } from '../../../application/features/contractualCondition/ContractualConditionSlice';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';
import ObjectPreviewModal from '../ObjectPreviewModal';
import styles from './InsuredDataFooter.module.scss';

const InsuredDataFooter: FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    insured,
    insuredAddress,
    biddingNumber,
    loadingProposal,
    loadingCanAuthorize,
    identification,
    specialAnalysisRequired,
    specialAnalysisDescription,
  } = useSelector(selectProposal);
  const {
    loadingContractualCondition,
    openContractualConditions,
    text,
    requestedBy,
  } = useSelector(selectContractualCondition);
  const { errors } = useSelector(selectValidation);

  const disabledSubmitButton = useMemo(() => {
    const hasDefaultFields =
      insured?.insuredId &&
      insuredAddress?.addressId &&
      biddingNumber &&
      errors.biddingNumber === undefined &&
      identification?.PolicyId;
    const hasContratualCondition = text && requestedBy;
    const needSpecialAnalysis =
      specialAnalysisRequired && specialAnalysisDescription.length === 0;
    return (
      !hasDefaultFields ||
      (openContractualConditions && !hasContratualCondition) ||
      needSpecialAnalysis ||
      loadingContractualCondition ||
      loadingProposal ||
      loadingCanAuthorize
    );
  }, [
    biddingNumber,
    identification?.PolicyId,
    insured?.federalId,
    insuredAddress?.addressId,
    loadingContractualCondition,
    loadingProposal,
    loadingCanAuthorize,
    openContractualConditions,
    requestedBy,
    text,
    specialAnalysisRequired,
    specialAnalysisDescription,
    errors,
  ]);

  const disabledObjectPreviewButton = useMemo(
    () =>
      !identification?.PolicyId ||
      loadingProposal ||
      loadingContractualCondition,
    [identification?.PolicyId, loadingProposal, loadingContractualCondition],
  );

  const handleToggleModal = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
  };

  return (
    <footer className={styles['insured-data-footer__wrapper']}>
      <Button
        id="insuredDataFooter-show-object-preview-button"
        data-testid="insuredDataFooter-show-object-preview-button"
        type="button"
        variant="secondary"
        fullWidth
        onClick={() => handleToggleModal(true)}
        disabled={disabledObjectPreviewButton}
      >
        Clique para visualizar o objeto
      </Button>
      <Button
        id="insuredDataFooter-submit-button"
        data-testid="insuredDataFooter-submit-button"
        type="submit"
        fullWidth
        disabled={disabledSubmitButton}
        loading={loadingProposal || loadingCanAuthorize}
      >
        Continuar
      </Button>
      <ObjectPreviewModal
        isModalOpen={isModalOpen}
        onToggleModal={handleToggleModal}
      />
    </footer>
  );
};

export default InsuredDataFooter;
