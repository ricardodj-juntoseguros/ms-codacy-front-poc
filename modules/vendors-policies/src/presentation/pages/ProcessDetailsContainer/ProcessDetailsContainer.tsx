import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Divider,
  LinkButton,
  ThemeContext,
  makeToast,
} from 'junto-design-system';
import className from 'classnames';
import { UserTypeEnum, VendorsAuthService } from '@services';
import { federalIdFormatter, currencyFormatter } from '@shared/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { DetailField, FileList } from '@shared/ui';
import { ProcessDetailsModel } from '../../../application/types/model';
import DocumentAPI from '../../../application/features/document/DocumentAPI';
import ProcessDetailsAPI from '../../../application/features/processDetails/ProcessDetailsAPI';
import { PROCESS_STATUS } from '../../../constants/processStatus';
import styles from './ProcessDetailsContainer.module.scss';
import ProcessDetailsHeader from '../../components/ProcessDetailsHeader';
import ProcessDetailsAside from '../../components/ProcessDetailsAside/ProcessDetailsAside';
import ProcessDetailsFooter from '../../components/ProcessDetailsFooter/ProcessDetailsFooter';

function ProcessDetailsContainer() {
  const theme = useContext(ThemeContext);
  const { proposalId } = useParams<{ proposalId: string }>();
  const [processDetails, setProcessDetails] =
    useState<ProcessDetailsModel | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const navigate = useNavigate();
  const userType = VendorsAuthService.getUserType();

  // eslint-disable-next-line consistent-return
  const processStatusConfig = useMemo(() => {
    if (processDetails) {
      return (
        PROCESS_STATUS.find(pStatus => pStatus.id === processDetails.status) ||
        PROCESS_STATUS[0]
      );
    }
  }, [processDetails]);

  useLayoutEffect(() => {
    const getProcessDetails = () => {
      ProcessDetailsAPI.getProcessDetails(Number(proposalId))
        .then(response => {
          const formattedResponse: ProcessDetailsModel = {
            ...response,
            policyholderFederalIdFormatted: federalIdFormatter(
              response.policyholder.federalId,
            ),
            securedAmountFormatted: currencyFormatter(response.securedAmount),
            ...(response.netPrize && {
              netPrizeFormatted: currencyFormatter(response.netPrize),
            }),
            ...(response.comission && {
              comissionFormatted: currencyFormatter(response.comission),
            }),
            initialValidityFormatted: format(
              new Date(response.initialValidity),
              'dd/MM/yyyy',
            ),
            endValidityFormatted: format(
              new Date(response.endValidity),
              'dd/MM/yyyy',
            ),
          };
          setProcessDetails(formattedResponse);
          getProcessDocuments(response.identification.policyid);
        })
        .catch(() => {
          makeToast(
            'error',
            'Ocorreu um erro ao buscar os detalhes da proposta.',
          );
          navigate('/');
        });
    };

    if (!Number.isSafeInteger(Number(proposalId))) {
      navigate('/');
    }

    getProcessDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className={styles['process-details-container__wrapper']}>
      {processDetails && (
        <>
          <header className={styles['process-details-container__header']}>
            <LinkButton
              label="Voltar para meu painel"
              icon="arrow-left"
              onClick={() => navigate(-1)}
            />
          </header>
          <section className={styles['process-details-container__content']}>
            <ProcessDetailsHeader
              policyId={processDetails.identification.policyid}
              proposalId={Number(proposalId)}
              createdAt={processDetails.createdAt}
              processStatusConfig={processStatusConfig}
              userType={userType}
              dateIssuance={processDetails.dateIssuance}
              policyNumber={processDetails.identification.policyNumber}
            />
            <div
              className={styles['process-details-container__content-values']}
            >
              <DetailField
                title="Fornecedor"
                values={[processDetails.policyholder.companyName]}
              />
              <DetailField
                title="CNPJ do Fornecedor"
                values={[processDetails.policyholderFederalIdFormatted]}
              />
              <DetailField
                title="Modalidade"
                values={[processDetails.product.modality]}
              />

              <div className={styles['proposal-details-container__divider']}>
                <Divider />
              </div>

              <div
                className={styles['proposal-details-container__item-inline']}
              >
                <DetailField
                  title="Valor da cobertura"
                  values={[processDetails.securedAmountFormatted]}
                />
                {processDetails.netPrizeFormatted &&
                  userType === UserTypeEnum.POLICYHOLDER && (
                    <DetailField
                      title="Custo da garantia"
                      values={[processDetails.netPrizeFormatted]}
                    />
                  )}
              </div>

              <div
                className={styles['proposal-details-container__item-inline']}
              >
                <DetailField
                  title="Início da vigência"
                  values={[processDetails.initialValidityFormatted]}
                />
                <DetailField
                  title="Final da vigência"
                  values={[processDetails.endValidityFormatted]}
                />
              </div>

              <DetailField
                title="Total em dias"
                values={[processDetails.durationInDays]}
              />

              {userType === UserTypeEnum.BROKER && (
                <div
                  className={styles['proposal-details-container__item-inline']}
                >
                  {processDetails.comissionFormatted && (
                    <DetailField
                      title="Comissão"
                      values={[processDetails.comissionFormatted]}
                    />
                  )}

                  {processDetails.netPrizeFormatted && (
                    <DetailField
                      title="Prêmio"
                      values={[processDetails.netPrizeFormatted]}
                    />
                  )}
                </div>
              )}

              <div className={styles['proposal-details-container__divider']}>
                <Divider />
              </div>

              <h2
                className={className(
                  styles['process-details-container__subtitle'],
                  styles[theme],
                )}
              >
                Informações do contrato
              </h2>

              <DetailField
                title="N.° do contrato"
                values={[processDetails.contractNumber]}
              />
              {files.length !== 0 && (
                <DetailField title="Anexos" values={[]}>
                  <FileList files={files} />
                </DetailField>
              )}
            </div>
            <ProcessDetailsFooter
              processStatusConfig={processStatusConfig}
              userType={userType}
            />
          </section>
          {processDetails.project?.name && (
            <ProcessDetailsAside name={processDetails.project?.name} />
          )}
        </>
      )}
    </div>
  );
}

export default ProcessDetailsContainer;
