import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  Divider,
  LinkButton,
  ThemeContext,
  makeToast,
} from 'junto-design-system';
import className from 'classnames';
import { VendorsAuthService } from '@services';
import {
  federalIdFormatter,
  currencyFormatter,
  downloadFile,
} from '@shared/utils';
import { useHistory, useParams } from 'react-router';
import { format } from 'date-fns';
import { nanoid } from '@reduxjs/toolkit';
import DocumentAPI from '../../../application/features/document/DocumentAPI';
import ProcessDetailsAPI from '../../../application/features/processDetails/ProcessDetailsAPI';
import { PROCESS_STATUS } from '../../../constants/processStatus';
import styles from './ProcessDetails.module.scss';
import DetailField from '../../components/DetailField/DetailField';
import { ProcessDetailDTO } from '../../../application/types/dto/ProcessDetailDTO';

function ProcessDetails() {
  const theme = useContext(ThemeContext);
  const { proposalId } = useParams<{ proposalId: string }>();
  const [processDetails, setProcessDetails] =
    useState<ProcessDetailDTO | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const history = useHistory();

  // eslint-disable-next-line consistent-return
  const processStatusConfig = useMemo(() => {
    if (processDetails) return PROCESS_STATUS[processDetails.status];
  }, [processDetails]);

  useLayoutEffect(() => {
    getProcessDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProcessDetails = useCallback(async () => {
    if (!Number.isSafeInteger(Number(proposalId))) {
      history.push('/');
    }
    ProcessDetailsAPI.getProcessDetails(Number(proposalId))
      .then(response => {
        setProcessDetails(response);
        getProcessDocuments(response.identification.policyid);
      })
      .catch(() => {
        makeToast(
          'error',
          'Ocorreu um erro ao buscar os detalhes da proposta.',
        );
        history.push('/');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, proposalId]);

  const getProcessDocuments = useCallback(
    async (policyId: number) => {
      DocumentAPI.getProposalDocuments(policyId)
        .then((response: any) => setFiles(response))
        .catch(() => {
          makeToast('error', 'Ocorreu um erro ao buscar os documentos.');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const renderFiles = () => {
    if (files.length === 0) return null;
    return files.map(file => (
      <p
        className={className(
          styles['proposal-details__item-attachment'],
          styles[theme],
        )}
        key={nanoid(5)}
      >
        {file.filename}
        <span>{(file.size / 1048576).toFixed(2)} MB</span>
      </p>
    ));
  };

  const renderStatus = () => {
    if (!processStatusConfig) return null;
    const { detailsMessage, detailsIcon, name, detailsMessagePolicyholder } =
      processStatusConfig;

    const userType = VendorsAuthService.getUserType();
    const message =
      detailsMessagePolicyholder && userType === 'policyholder'
        ? detailsMessagePolicyholder
        : detailsMessage;

    return (
      <p
        data-testid="processDetails-paragraph-status"
        className={className(
          styles['process-details__status'],
          styles[`process-details__status--${name}`],
          styles[theme],
        )}
      >
        <i className={`icon icon-${detailsIcon}`} />
        {message}
      </p>
    );
  };

  const renderTitle = () => {
    if (!processStatusConfig || !processDetails) return null;
    const { name } = processStatusConfig;
    let title = '';
    let text = '';

    if (
      [
        'under-analysis',
        'awaiting-approval',
        'refused',
        'in-progress',
      ].includes(name)
    ) {
      title = `Solicitação ${processDetails.identification.policyid}`;
      text = `Proposta ${processDetails.identification.policyid}, ${format(
        new Date(processDetails.createdAt),
        "dd/MM/yyyy 'às' HH'h'mm",
      )}`;
    } else {
      title = `Apólice ${processDetails.identification.policynumber}`;
      text = `Contratada em, ${format(
        new Date(processDetails.createdAt),
        'dd/MM/yyyy',
      )}`;
    }
    return (
      <>
        <h1
          className={className(styles['process-details__title'], styles[theme])}
        >
          {title}
        </h1>
        <p
          className={className(styles['process-details__text'], styles[theme])}
        >
          {text}
        </p>
      </>
    );
  };

  const renderNotifyInssuanceClaimButton = () => {
    if (!processStatusConfig || !processDetails) return null;
    const userType = VendorsAuthService.getUserType();
    const { name } = processStatusConfig;

    if (
      ['issued', 'to-expire', 'expired'].includes(name) &&
      userType !== 'policyholder'
    ) {
      return (
        <button
          data-testid="processDetails-button-issuance-claim"
          type="button"
          className={className(
            styles['process-details__button'],
            styles[theme],
          )}
          onClick={() => handleNotifyIssuanceClaim()}
        >
          <i className="icon icon-arrow-up-right" />
          Avisar sinistro
        </button>
      );
    }

    return null;
  };

  const renderDownloadPolicyDocumentButton = () => {
    if (!processStatusConfig || !processDetails) return null;
    const { name } = processStatusConfig;

    if (['issued', 'to-expire', 'expired'].includes(name)) {
      return (
        <Button
          data-testid="processDetails-button-download-policy"
          type="button"
          onClick={() => handleDownloadPolicyDocument()}
        >
          Baixar apólice
        </Button>
      );
    }

    return null;
  };

  const handleNotifyIssuanceClaim = () => {
    window.open('https://www.juntoseguros.com/canal-de-sinistro/', '_blank');
  };

  const handleCertificateOfGoodStanding = () => {
    window.open(
      `${process.env.NX_GLOBAL_MS_DOCUMENTS}certificateRegularity/download?format=pdf`,
      '_blank',
    );
  };

  const handleDownloadPolicyDocument = () => {
    if (!processDetails) return;

    DocumentAPI.getPolicyDocument(processDetails.identification.policyid)
      .then((response: any) => {
        downloadFile(response.linkDocumento);
      })
      .catch(error => makeToast('error', error.data.data.message));
  };

  const handleDownloadDocuments = () => {
    files.forEach(file => downloadFile(file.url));
  };

  return (
    <div className={styles['process-details__wrapper']}>
      <header className={styles['process-details__header']}>
        <LinkButton
          label="Voltar para meu painel"
          icon="arrow-left"
          onClick={() => history.goBack()}
        />
      </header>
      {processDetails && (
        <section className={styles['process-details__content']}>
          {renderTitle()}
          {renderDownloadPolicyDocumentButton()}
          {renderStatus()}

          <div className={styles['process-details__content-values']}>
            <DetailField
              title="Fornecedor"
              values={[processDetails.policyholder.companyName]}
            />
            <DetailField
              title="CNPJ do Fornecedor"
              values={[
                federalIdFormatter(processDetails.policyholder.federalId),
              ]}
            />
            <DetailField
              title="Modalidade"
              values={[processDetails.product.modality]}
            />

            <div className={styles['proposal-details__divider']}>
              <Divider />
            </div>

            <div className={styles['proposal-details__item-inline']}>
              <DetailField
                title="Valor da cobertura"
                values={[currencyFormatter(processDetails.securedAmount)]}
              />
              {processDetails.netPrize && (
                <DetailField
                  title="Custo da garantia"
                  values={[currencyFormatter(processDetails.securedAmount)]}
                />
              )}
            </div>

            <div className={styles['proposal-details__item-inline']}>
              <DetailField
                title="Início da vigência"
                values={[
                  format(
                    new Date(processDetails.initialValidity),
                    'dd/MM/yyyy',
                  ),
                ]}
              />
              <DetailField
                title="Final da vigência"
                values={[
                  format(new Date(processDetails.endValidity), 'dd/MM/yyyy'),
                ]}
              />
            </div>

            <DetailField
              title="Total em dias"
              values={[processDetails.durationInDays]}
            />

            <div className={styles['proposal-details__divider']}>
              <Divider />
            </div>

            <h2
              className={className(
                styles['process-details__subtitle'],
                styles[theme],
              )}
            >
              Informações do contrato
            </h2>

            <DetailField
              title="N.° do contrato"
              values={[processDetails.contractNumber]}
            />
            <DetailField title="Anexos" values={[]}>
              {renderFiles()}
              <LinkButton
                label="Ver anexos"
                icon="download"
                onClick={() => handleDownloadDocuments()}
                data-testid="processDetails-button-dowload-files"
              />
            </DetailField>

            <div className={styles['process-details__actions']}>
              <button
                data-testid="processDetails-button-certificate"
                type="button"
                className={className(
                  styles['process-details__button'],
                  styles[theme],
                )}
                onClick={() => handleCertificateOfGoodStanding()}
              >
                <i className="icon icon-arrow-up-right" />
                Certificado de regularidade
              </button>
              {renderNotifyInssuanceClaimButton()}
            </div>
          </div>
        </section>
      )}
      {/* <aside className={styles['process-details__aside']}>
        <h2 className={styles['process-details__title']}>Projeto</h2>
        <p className={styles['process-details__text']}>
          Este processo está vinculado a um projeto.
        </p>

        <div
          className={className(
            styles['process-details__project'],
            styles[theme],
          )}
        >
          <i className={className('icon', 'icon-clipboard', styles[theme])} />
          {processDetails.project?.name}
        </div>
      </aside> */}
    </div>
  );
}

export default ProcessDetails;
