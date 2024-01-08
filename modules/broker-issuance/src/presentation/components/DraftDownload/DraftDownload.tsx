import { FunctionComponent, useMemo } from 'react';
import { Button, makeToast } from 'junto-design-system';
import { downloadFile } from '@shared/utils';

import styles from './DraftDownload.module.scss';

interface DraftDownloadProps {
  isAutomaticPolicy: boolean;
  proposalDraft: string;
}

const DraftDownload: FunctionComponent<DraftDownloadProps> = ({
  isAutomaticPolicy,
  proposalDraft,
}) => {
  const text = useMemo(
    () =>
      isAutomaticPolicy
        ? 'Tudo certo até aqui! Agora você já pode baixar a sua minuta.'
        : 'Agora você já pode baixar a sua minuta e validar sua garantia.',
    [isAutomaticPolicy],
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
        >
          Copiar link
        </Button>
        <Button
          id="draftDownload-download-draft-click"
          data-testid="draftDownload-download-draft-click"
          size="large"
          variant="secondary"
          onClick={() => handleDownloadDraft()}
        >
          Baixar minuta
        </Button>
      </div>
    </section>
  );
};

export default DraftDownload;
