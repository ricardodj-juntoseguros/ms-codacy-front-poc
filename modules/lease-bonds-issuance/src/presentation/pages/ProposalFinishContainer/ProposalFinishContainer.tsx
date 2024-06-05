import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { downloadFile } from '@shared/utils';
import { RouteComponentProps } from 'react-router';
import {
  Button,
  NPSWidget,
  LinkButton,
  Tag,
  makeToast,
} from 'junto-design-system';
import { useSelector } from 'react-redux';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import {
  ProposalFinishEnum,
  SurveyTypeEnum,
} from '../../../application/types/model';
import { PROPOSAL_FINISH_DATA } from '../../../constants/proposalFinish';
import styles from './ProposalFinishContainer.module.scss';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import ProposalDocumentsApi from '../../../application/features/proposalDocuments/ProposalDocumentsApi';
import { useSurvey } from '../../hooks';

interface ProposalFinishContainerProps extends RouteComponentProps {
  feedbackType: ProposalFinishEnum;
}

const ProposalFinishContainer: React.FC<ProposalFinishContainerProps> = ({
  feedbackType,
}) => {
  const { identification, protocols } = useSelector(selectProposal);
  const { currentQuote } = useSelector(selectQuote);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const npsType =
    feedbackType === ProposalFinishEnum.success
      ? SurveyTypeEnum.NPS_DIRECT
      : SurveyTypeEnum.NPS_INTERNALIZED;
  const [
    showWidget,
    widgetProps,
    getSurveyInvite,
    answerSurvey,
    setShouldAnswer,
  ] = useSurvey(npsType);
  const { PolicyId } = identification || { PolicyId: null };
  const userProfile = BrokerPlatformAuthService.getUserProfile();

  const componentData = useMemo(
    () => PROPOSAL_FINISH_DATA[feedbackType],
    [feedbackType],
  );

  const protocol = useMemo(() => {
    if (protocols.length === 1) return protocols[0].text;
    return (
      protocols.find(protocol => protocol.text.includes('Contratada'))?.text ||
      ''
    );
  }, [protocols]);

  useEffect(() => {
    if (!identification || !currentQuote) {
      window.location.assign('/proposal');
      return;
    }
    if (userProfile !== ProfileEnum.COMMERCIAL) getSurveyInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoToProcessList = () => {
    window.location.assign(
      process.env.NX_GLOBAL_BROKER_PROCESSES_LIST_URL || '',
    );
  };

  const renderIcon = () => {
    const Icon = componentData.icon;
    return <Icon />;
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
        {renderIcon()}
      </motion.div>
      <div>
        {protocol && (
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
          {componentData.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, translateY: '-20px' }}
          whileInView={{ opacity: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className={styles['proposal-finish-container__text']}
        >
          {componentData.description}
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
        {feedbackType === ProposalFinishEnum.analysis && (
          <LinkButton
            data-testid="proposalFinishContainer-download-button"
            loading={loadingDownload}
            label="Download da proposta"
            size="small"
            onClick={() => handleDownloadProposalClick()}
          />
        )}
      </motion.div>
      <NPSWidget
        id="proposalFinishContainer"
        isOpen={showWidget}
        onSubmit={answerSurvey}
        onClose={() => setShouldAnswer(false)}
        {...widgetProps}
      />
    </div>
  );
};

export default ProposalFinishContainer;
