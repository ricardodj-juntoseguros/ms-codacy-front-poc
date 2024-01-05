import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parse } from 'date-fns';
import { downloadFile } from '@shared/utils';
import { RouteComponentProps } from 'react-router';
import { Button, LinkButton, Tag, makeToast } from 'junto-design-system';
import { useSelector } from 'react-redux';
import { ReactComponent as AnalisysIcon } from './assets/analysis.svg';
import { ReactComponent as SuccessIcon } from './assets/success.svg';
import styles from './ProposalFinishContainer.module.scss';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import ProposalDocumentsApi from '../../../application/features/proposalDocuments/ProposalDocumentsApi';

interface ProposalFinishContainerProps extends RouteComponentProps {
  feedbackType: 'success' | 'analysis';
}

const ProposalFinishContainer: React.FC<ProposalFinishContainerProps> = ({
  feedbackType,
}) => {
  const { identification, createdAt } = useSelector(selectProposal);
  const { currentQuote } = useSelector(selectQuote);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const { PolicyId } = identification || { PolicyId: null };

  useEffect(() => {
    if (!identification || !currentQuote) {
      window.location.assign('/proposal');
    }
  }, [identification, currentQuote]);

  const protocol = useMemo(() => {
    if (!createdAt) return null;
    return `Proposta ${PolicyId} - ${format(
      parse(createdAt.split('.')[0], "yyyy-MM-dd'T'HH:mm:ss", new Date()),
      "dd/MM/yyyy 'às' HH'h'mm",
    )}`;
  }, [PolicyId, createdAt]);

  const handleGoToProcessList = () => {
    window.location.assign(process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '');
  };

  const handleDownloadProposalClick = () => {
    if (loadingDownload || !currentQuote) return;
    setLoadingDownload(true);
    ProposalDocumentsApi.getProposalDocumentForDownload(
      currentQuote.identification.ProposalId,
    )
      .then((result: any) => {
        const file = new Blob([result], {
          type: 'application/pdf',
        });
        downloadFile(file, `proposta_${PolicyId}.pdf`);
      })
      .catch(() =>
        makeToast('error', 'Ocorreu um erro inesperado ao gerar o documento.'),
      )
      .finally(() => setLoadingDownload(false));
  };

  return (
    <div className={styles['proposal-finish-container__wrapper']}>
      <motion.div
        initial={{ opacity: 0, scale: 0.01 }}
        whileInView={{ opacity: 1, scale: 1.0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        {feedbackType === 'analysis' && <AnalisysIcon />}
        {feedbackType === 'success' && <SuccessIcon />}
      </motion.div>
      <div>
        {feedbackType === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, translateY: '-10px' }}
            whileInView={{ opacity: 1, translateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 0.4 }}
            className={styles['proposal-finish-container__tag']}
          >
            <Tag variant="neutral">{protocol}</Tag>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, translateY: '-50px' }}
          whileInView={{ opacity: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className={styles['proposal-finish-container__title']}
        >
          {feedbackType === 'success'
            ? 'Sua apólice foi emitida!'
            : 'Sua solicitação está em análise'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, translateY: '-20px' }}
          whileInView={{ opacity: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className={styles['proposal-finish-container__text']}
        >
          {feedbackType === 'success'
            ? 'Em alguns instantes você receberá via email sua apólice de seguro e o boleto para pagamento.'
            : 'Em breve você receberá o retorno da nossa equipe.'}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, translateY: '50px' }}
        whileInView={{ opacity: 1, translateY: '0px' }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 1.2 }}
        className={styles['proposal-finish-container__buttons']}
      >
        <Button
          data-testid="proposalFinishContainer-processes-button"
          variant="primary"
          onClick={() => handleGoToProcessList()}
        >
          Ir para a lista de processos
        </Button>
        {feedbackType === 'analysis' && (
          <LinkButton
            data-testid="proposalFinishContainer-download-button"
            loading={loadingDownload}
            label="Download da proposta"
            size="small"
            onClick={() => handleDownloadProposalClick()}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ProposalFinishContainer;
