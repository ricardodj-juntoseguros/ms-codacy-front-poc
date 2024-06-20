/* eslint-disable react/no-danger */
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, makeToast } from 'junto-design-system';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectPolicyRenewal } from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import handleError from '../../../helpers/handlerError';
import ObjectPreviewSkeleton from '../Skeletons/ObjectPreviewSkeleton';
import { objectPreviewAdapter } from '../../../application/features/objectPreview/adapters';
import ObjectPreviewApi from '../../../application/features/objectPreview/ObjectPreviewApi';
import { selectAdditionalCoverage } from '../../../application/features/additionalCoverage/AdditionalCoverageSlice';
import styles from './ObjectPreviewModal.module.scss';

export interface ObjectPreviewModalProps {
  isModalOpen: boolean;
  onToggleModal: (isOpen: boolean) => void;
}

export const ObjectPreviewModal: FunctionComponent<ObjectPreviewModalProps> = ({
  isModalOpen,
  onToggleModal,
}) => {
  const [objectPreview, setObjectPreview] = useState<string>('');
  const [loadingObjectPreview, setLoadingObjectPreview] =
    useState<boolean>(true);
  const quote = useSelector(selectQuote);
  const proposal = useSelector(selectProposal);
  const additionalCoverage = useSelector(selectAdditionalCoverage);
  const policyRenewal = useSelector(selectPolicyRenewal);

  useEffect(() => {
    const getObjectPreview = async () => {
      const payload = objectPreviewAdapter(
        quote,
        proposal,
        additionalCoverage,
        policyRenewal,
      );
      setLoadingObjectPreview(true);
      if (!payload) return;
      try {
        const result = await ObjectPreviewApi.getObjectPreview(payload);
        setObjectPreview(result.objectInsuranceText);
      } catch (error) {
        makeToast('error', handleError(error));
      } finally {
        setLoadingObjectPreview(false);
      }
    };
    if (isModalOpen) getObjectPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  return (
    <Modal
      open={isModalOpen}
      onClose={() => onToggleModal(false)}
      onBackdropClick={() => onToggleModal(false)}
      size="large"
    >
      {loadingObjectPreview ? (
        <ObjectPreviewSkeleton />
      ) : (
        <>
          <h2 className={styles['object-preview-modal__title']}>
            O objeto da sua apólice de seguro vai ficar assim:
          </h2>
          <section
            className={styles['object-preview-modal__content']}
            dangerouslySetInnerHTML={{ __html: objectPreview }}
          />
        </>
      )}
    </Modal>
  );
};

export default ObjectPreviewModal;
