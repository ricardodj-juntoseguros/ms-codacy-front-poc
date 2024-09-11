/* eslint-disable consistent-return */
import {
  Button,
  LinkButton,
  Tag,
  ThemeContext,
  makeToast,
} from 'junto-design-system';
import {
  useContext,
  useLayoutEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import className from 'classnames';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { downloadFile } from '@shared/utils';
import { ERROR_MESSAGES, REDIRECT_URLS } from '../../../constants';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import styles from './ProposalSuccessContainer.module.scss';
import DownloadProposalDocumentAPI from '../../../application/features/downloadProposalDocument/DownloadProposalDocumentAPI';

const ProposalSuccessContainer: React.FunctionComponent = () => {
  const [isLoadingProposalDocument, setIsLoadingProposalDocument] =
    useState(false);
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  const { identification, createdAt } = useSelector(selectProposal);
  const protocol = useMemo(
    () =>
      `Proposta ${identification?.policyId} - ${format(
        new Date(createdAt),
        "dd/MM/yyyy 'às' HH'h'mm",
      )}`,
    [identification, createdAt],
  );

  useLayoutEffect(() => {
    if (!identification?.proposalId || !identification?.policyId) navigate('/');
  }, [navigate, identification?.policyId, identification?.proposalId]);

  const handleDownloadProposalDocument = useCallback(async () => {
    if (!identification?.proposalId) return;

    setIsLoadingProposalDocument(true);
    DownloadProposalDocumentAPI.getProposalDocument(identification?.proposalId)
      .then((result: any) => {
        const file = new Blob([result], {
          type: 'application/pdf',
        });
        downloadFile(file, `proposta_${identification?.policyId}.pdf`);
      })
      .catch(() => {
        makeToast('error', ERROR_MESSAGES.error);
      })
      .finally(() => setIsLoadingProposalDocument(false));
  }, [identification]);

  const handleGoHome = () => window.location.assign(REDIRECT_URLS.policies);

  return (
    <section
      className={className(
        styles['proposal-success-container__wrapper'],
        styles[theme],
      )}
    >
      <i className={className('icon', 'icon-check', styles[theme])} />
      <Tag>{protocol}</Tag>
      <h1
        className={className(
          styles['proposal-success-container__title'],
          styles[theme],
        )}
      >
        Solicitação realizada! Fique de olho, entraremos em contato com você.
      </h1>
      <p
        className={className(
          styles['proposal-success-container__text'],
          styles[theme],
        )}
      >
        Você receberá um e-mail quando houver alguma evolução nesta sua
        solicitação.
      </p>
      <div className={styles['proposal-success-container__button']}>
        <Button
          type="button"
          fullWidth
          data-testid="proposalSuccess-button-go-home"
          onClick={() => handleGoHome()}
        >
          Acessar meu painel
        </Button>
      </div>
      <LinkButton
        data-testid="proposalSuccess-button-download-proposal"
        label="Download da proposta"
        icon="download"
        size="large"
        onClick={() => handleDownloadProposalDocument()}
        disabled={isLoadingProposalDocument}
      />
    </section>
  );
};

export default ProposalSuccessContainer;
