import { Divider, Tag, ThemeContext, makeToast } from 'junto-design-system';
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
} from 'react';
import className from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currencyFormatter } from '@shared/utils';
import { DetailField, FileList, VendorsHeader } from '@shared/ui';
import { selectProjectSelection } from '../../../application/features/projectSelection/ProjectSelectionSlice';
import { ERROR_MESSAGES, REDIRECT_URLS } from '../../../constants';
import IssuanceAPI from '../../../application/features/Issuance/IssuanceAPI';
import ProjectSelectionAPI from '../../../application/features/projectSelection/ProjectSelectionAPI';
import PolicyholderContactAPI from '../../../application/features/policyholderContact/PolicyholderContactAPI';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { useFiles } from '../../../config/filesContext';
import ProposalSummaryAside from '../../components/ProposalSummaryAside/ProposalSummaryAside';
import { AppDispatch } from '../../../config/store';
import styles from './ProposalSummaryContainer.module.scss';

const ProposalSummaryContainer: React.FunctionComponent = () => {
  const [issuanceLoading, setIssuanceLoading] = useState(false);
  const [policyExternalId, setPolicyExternalId] = useState('');
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
  const dispatch: AppDispatch = useDispatch();
  const { projectSearchValue } = useSelector(selectProjectSelection);
  const navigate = useNavigate();
  const { files, uploadDocuments } = useFiles();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    if (!identification?.proposalId || !identification?.policyId) navigate('/');
  }, [navigate, identification?.policyId, identification?.proposalId]);

  const renderFiles = () => {
    if (!files) return null;
    const filesList = files.map(file => ({
      filename: file.file.name,
      size: file.file.size,
      url: file.file,
    }));

    return <FileList files={filesList} />;
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
    if (!policyExternalId)
      await onlinkProject(identification.policyId, insuredFederalId);

    const result = await uploadDocuments();
    if (!result) {
      setIssuanceLoading(false);
      return;
    }

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
        .then(() => navigate('success'))
        .catch(() => {
          makeToast('error', ERROR_MESSAGES.submitProposalToApproval);
          setIssuanceLoading(false);
        });
    },
    [navigate],
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
        .then(result => {
          setPolicyExternalId(result.policyExternalId);
        })
        .catch(() => makeToast('error', ERROR_MESSAGES.error));
    },
    [project, projectSearchValue],
  );

  const handleEditProposal = () => {
    dispatch(proposalActions.setCreateProposalSuccess(false));
    navigate('/');
  };

  return (
    <>
      <VendorsHeader
        showMenuItems={false}
        backButton={() => window.location.assign(REDIRECT_URLS.policies)}
      />

      <div className={styles['proposal-summary-container__wrapper']}>
        <header className={styles['proposal-summary-container__header']}>
          <Tag>Solicitação {identification?.policyId}</Tag>
          <h1
            className={className(
              styles['proposal-summary-container__title'],
              styles[theme],
            )}
          >
            Por último, confira os dados e solicite sua garantia.
          </h1>
        </header>
        <section className={styles['proposal-summary-container__informations']}>
          <DetailField
            title="Tipo de seguro garantia"
            values={[modality.externalDescription]}
          />
          <DetailField
            title="Valor total garantido"
            values={[currencyFormatter(totalValue)]}
            helpText={
              additionalCoverageLabor
                ? 'Com cobertura adicional Trabalhista e Previdenciária'
                : ''
            }
          />
          <DetailField
            title="Percentual da garantia"
            values={[warrantyPercentage]}
          />
          <div className={styles['proposal-summary-container__item-validity']}>
            <DetailField
              title="Início da vigência"
              values={[initialValidity]}
            />
            <DetailField title="Final da vigência" values={[endValidity]} />
          </div>
          <DetailField
            title="Tempo de vigência do seguro"
            values={[`${validityInDays} dias`]}
          />
          <div className={styles['proposal-summary-container__divider']}>
            <Divider />
          </div>
          <DetailField title="Empresa contratante" values={[insuredName]} />
          <DetailField
            title="Empresa contratada"
            values={[getPolicyholderInfo()]}
          />
          <DetailField
            title="Contato da empresa contratada"
            values={[policyholderContact.name, policyholderContact.email]}
          />
          <div className={styles['proposal-summary-container__divider']}>
            <Divider />
          </div>
          <h2
            className={className(
              styles['proposal-summary-container__subtitle'],
              styles[theme],
            )}
          >
            Informações do contrato
          </h2>
          <div className={styles['proposal-summary-container__item-contract']}>
            <DetailField title="N.° do contrato" values={[contractNumber]} />
            <DetailField
              title="Valor do contrato"
              values={[currencyFormatter(contractValue)]}
            />
          </div>
          {(project || projectSearchValue) && (
            <DetailField
              title="Projeto"
              values={[project ? project.label : projectSearchValue]}
            />
          )}
          <DetailField title="Anexos" values={[]}>
            {renderFiles()}
          </DetailField>
        </section>
        <ProposalSummaryAside
          handleEdit={handleEditProposal}
          handleSubmit={handleSubmit}
          loading={issuanceLoading}
        />
      </div>
    </>
  );
};

export default ProposalSummaryContainer;
