/* eslint-disable consistent-return */
import {
  Button,
  Divider,
  LinkButton,
  Tag,
  ThemeContext,
  makeToast,
} from 'junto-design-system';
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
} from 'react';
import className from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { currencyFormatter, downloadFile } from '@shared/utils';
import { nanoid } from '@reduxjs/toolkit';
import { VendorsHeader } from '@shared/ui';
import { selectProjectSelection } from '../../../application/features/projectSelection/ProjectSelectionSlice';
import { ERROR_MESSAGES, REDIRECT_URLS } from '../../../constants';
import IssuanceAPI from '../../../application/features/Issuance/IssuanceAPI';
import ProjectSelectionAPI from '../../../application/features/projectSelection/ProjectSelectionAPI';
import PolicyholderContactAPI from '../../../application/features/policyholderContact/PolicyholderContactAPI';
import ProposalAPI from '../../../application/features/proposal/ProposalAPI';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { useFiles } from '../../../config/filesContext';
import SummaryField from '../../components/SummaryField';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from './ProposalSummary.module.scss';

const ProposalSummary: React.FunctionComponent = () => {
  const [issuanceLoading, setIssuanceLoading] = useState(false);
  const theme = useContext(ThemeContext);
  const {
    policyholder,
    identification,
    policyholderContact,
    project,
    modality,
    totalValue,
    additionalCoverageLabor,
    warrantyPercentage,
    initialValidity,
    endValidity,
    validityInDays,
    insuredName,
    contractNumber,
    contractValue,
    insuredFederalId,
  } = useSelector(selectProposal);
  const dispatch = useDispatch();
  const { projectSearchValue } = useSelector(selectProjectSelection);
  const history = useHistory();
  const { files, uploadDocuments } = useFiles();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadFiles = () => {
    files.forEach(file => downloadFile(file.file));
  };

  useLayoutEffect(() => {
    if (!identification?.proposalId || !identification?.policyId)
      history.push('/');
  }, [history, identification?.policyId, identification?.proposalId]);

  const renderFiles = () => {
    if (!files) return null;
    return files.map(file => (
      <p
        className={className(
          styles['proposal-summary__item-attachment'],
          styles[theme],
        )}
        key={nanoid(5)}
      >
        {file.file.name}
        <span>{(file.file.size / 1048576).toFixed(2)} MB</span>
      </p>
    ));
  };

  const getPolicyholderInfo = () => {
    let label = '';

    if (policyholder.federalId) label = policyholder.federalId;
    if (policyholder.corporateName) label = policyholder.corporateName;

    return label;
  };

  const handleSubmit = async () => {
    if (!identification || !identification.proposalId) return;
    setIssuanceLoading(true);
    await ProposalAPI.updateProposalToAnalysis(identification.proposalId);
    await onlinkProject(identification.policyId, insuredFederalId);

    const result = await uploadDocuments();
    if (!result) return;

    if (
      policyholderContact &&
      policyholderContact.id.length === 0 &&
      policyholder.federalId
    ) {
      await PolicyholderContactAPI.createContact(
        policyholderContact.name,
        policyholderContact.email,
        policyholder.federalId,
      )
        .then(() => {
          onSubmitToApproval(identification.policyId);
        })
        .catch(() => {
          makeToast('error', ERROR_MESSAGES.createContact);
          setIssuanceLoading(false);
        });
    } else {
      onSubmitToApproval(identification.policyId);
    }
  };

  const onSubmitToApproval = useCallback(
    (policyId: number) => {
      return IssuanceAPI.submitToApproval(policyId)
        .then(() => history.push('success'))
        .catch(() => {
          makeToast('error', ERROR_MESSAGES.submitProposalToApproval);
          setIssuanceLoading(false);
        });
    },
    [history],
  );

  const onlinkProject = useCallback(
    async (policyId: number, insuredFederalId: string) => {
      const projectId = project ? project.value : null;
      return ProjectSelectionAPI.linkProject(
        projectSearchValue,
        projectId,
        policyId,
        insuredFederalId,
      )
        .then(() => {
          return true;
        })
        .catch(() => makeToast('error', ERROR_MESSAGES.error));
    },
    [project, projectSearchValue],
  );

  const handleEditProposal = () => {
    dispatch(proposalActions.setCreateProposalSuccess(false));
    history.push('/');
  };

  return (
    <>
      <VendorsHeader
        showMenuItems={false}
        backButton={() => window.location.assign(REDIRECT_URLS.policies)}
      />

      <div className={styles['proposal-summary__wrapper']}>
        <header className={styles['proposal-summary__header']}>
          <Tag>Solicitação {identification?.policyId}</Tag>
          <h1
            className={className(
              styles['proposal-summary__title'],
              styles[theme],
            )}
          >
            Por último, confira os dados e solicite sua garantia.
          </h1>
        </header>
        <section className={styles['proposal-summary__informations']}>
          <SummaryField
            title="Tipo de seguro garantia"
            values={[modality.externalDescription]}
          />
          <SummaryField
            title="Valor total garantido"
            values={[currencyFormatter(totalValue)]}
            helpText={
              additionalCoverageLabor
                ? 'Com cobertura adicional Trabalhista e Previdenciária'
                : ''
            }
          />
          <SummaryField
            title="Percentual da garantia"
            values={[warrantyPercentage]}
          />
          <div className={styles['proposal-summary__item-validity']}>
            <SummaryField
              title="Início da vigência"
              values={[initialValidity]}
            />
            <SummaryField title="Final da vigência" values={[endValidity]} />
          </div>
          <SummaryField
            title="Tempo de vigência do seguro"
            values={[`${validityInDays} dias`]}
          />
          <div className={styles['proposal-summary__divider']}>
            <Divider />
          </div>
          <SummaryField title="Empresa contratante" values={[insuredName]} />
          <SummaryField
            title="Empresa contratada"
            values={[getPolicyholderInfo()]}
          />
          <SummaryField
            title="Contato da empresa contratada"
            values={[policyholderContact.name, policyholderContact.email]}
          />
          <div className={styles['proposal-summary__divider']}>
            <Divider />
          </div>
          <h2
            className={className(
              styles['proposal-summary__subtitle'],
              styles[theme],
            )}
          >
            Informações do contrato
          </h2>
          <div className={styles['proposal-summary__item-contract']}>
            <SummaryField title="N.° do contrato" values={[contractNumber]} />
            <SummaryField
              title="Valor do contrato"
              values={[currencyFormatter(contractValue)]}
            />
          </div>
          {(project || projectSearchValue) && (
            <SummaryField
              title="Projeto"
              values={[project ? project.label : projectSearchValue]}
            />
          )}
          <SummaryField title="Anexos" values={[]}>
            {renderFiles()}
          </SummaryField>
          <LinkButton
            label="Baixar anexos"
            icon="download"
            onClick={() => handleDownloadFiles()}
            data-testid="proposalSummary-button-dowload-files"
          />
        </section>
        <aside className={styles['proposal-summary__actions']}>
          <Button
            fullWidth
            onClick={() => handleSubmit()}
            data-testid="proposalSummary-button-submit"
          >
            {issuanceLoading
              ? ((<LoadingSpinner />) as any)
              : 'Solicitar seguro garantia'}
          </Button>
          <LinkButton
            label="Editar solicitação"
            icon="edit"
            size="large"
            onClick={() => handleEditProposal()}
            data-testid="proposalSummary-button-edit"
          />
        </aside>
      </div>
    </>
  );
};

export default ProposalSummary;
