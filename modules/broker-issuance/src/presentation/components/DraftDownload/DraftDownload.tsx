/* eslint-disable react-hooks/exhaustive-deps */
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Button, makeToast } from 'junto-design-system';
import { downloadFile } from '@shared/utils';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectIssuance } from '../../../application/features/issuance/IssuanceSlice';
import handleError from '../../../helpers/handlerError';
import styles from './DraftDownload.module.scss';

const DraftDownload: FunctionComponent = () => {
  const { identification, isAutomaticPolicy } = useSelector(selectProposal);
  const { forceInternalize } = useSelector(selectIssuance);
  const [proposalDraft, setProposalDraft] = useState<string>('');

  useEffect(() => {
    getProposalDraft();
  }, []);

  const getProposalDraft = useCallback(() => {
    if (!identification?.PolicyId) return;
    ProposalApi.getProposalDraft(identification.PolicyId)
      .then(response => {
        setProposalDraft(response.draftLink);
      })
      .catch(error => makeToast('error', handleError(error)));
  }, [identification]);

  const text = useMemo(
    () =>
      isAutomaticPolicy && !forceInternalize
        ? 'Tudo certo até aqui! Agora você já pode baixar a sua minuta.'
        : 'Agora você já pode baixar a sua minuta e validar sua garantia.',
    [isAutomaticPolicy, forceInternalize],
  );

  const handleCopyDraftLink = () => {
    navigator.clipboard.writeText(proposalDraft);
    makeToast('success', 'Link copiado!');
  };

  const handleDownloadDraft = () => {
    downloadFile(proposalDraft, undefined, true);
  };

  return (
    <section className={styles['draft-download__wrapper']}>
      <p className={styles['draft-download__text']}>{text}</p>
      <div className={styles['draft-download__button-wrapper']}>
        <Button
          id="draftDownload-copy-draft-click"
          data-testid="draftDownload-copy-draft-click"
          size="large"
          variant="secondary"
          onClick={() => handleCopyDraftLink()}
          disabled={!proposalDraft}
        >
          Copiar link
        </Button>
        <Button
          id="draftDownload-download-draft-click"
          data-testid="draftDownload-download-draft-click"
          size="large"
          variant="secondary"
          onClick={() => handleDownloadDraft()}
          disabled={!proposalDraft}
        >
          Baixar minuta
        </Button>
      </div>
    </section>
  );
};

export default DraftDownload;
