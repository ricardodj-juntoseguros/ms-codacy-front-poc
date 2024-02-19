/* eslint-disable react-hooks/exhaustive-deps */
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  LinkButton,
  Skeleton,
  TextArea,
  makeToast,
} from 'junto-design-system';
import { useHistory } from 'react-router';
import { GenericComponentProps } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { selectCommercialAuthorization } from '../../../application/features/CommercialAuthorization/CommercialAuthorizationSlice';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { useProposal } from '../../hooks';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import handleError from '../../../helpers/handlerError';
import { selectProposalDocuments } from '../../../application/features/proposalDocuments/ProposalDocumentsSlice';
import { POLICYHOLDER_ISSUE_PERMISSION } from '../../../constants';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import TermsOfAcceptanceModal from '../TermsOfAcceptanceModal';
import PaymentFields from '../PaymentFields';
import ProposalDocuments from '../ProposalDocuments';
import DraftDownload from '../DraftDownload';
import CommercialAuthorization from '../CommercialAuthorization';
import { useIssuance } from '../../hooks/useIssuance';
import CommercialAuthorizationModal from '../CommercialAuthorizationModal';
import styles from './AdditionalDataForm.module.scss';

const AdditionalDataForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  const [loadingField, setLoadingField] = useState('');
  const [openModal, setOpenModal] = useState('');
  const [proposalDraft, setProposalDraft] = useState<string>('');
  const { errors } = useSelector(selectValidation);
  const dispatch = useDispatch();
  const { loadingQuote } = useSelector(selectQuote);
  const {
    comments,
    identification,
    isAutomaticPolicy,
    firstDueDate,
    numberOfInstallments,
    hasOnlyFinancialPending,
    loadingProposal,
    currentProposal,
  } = useSelector(selectProposal);
  const { proposalDocuments } = useSelector(selectProposalDocuments);
  const { approvalContacts, documentsForAuthorization, typeOfAuthorization } =
    useSelector(selectCommercialAuthorization);
  const updateProposal = useProposal();
  const [createIssuanceOrSubmitToApproval, loadingIssuance] = useIssuance();
  const history = useHistory();
  const { setComments } = proposalActions;
  const userProfile = BrokerPlatformAuthService.getUserProfile();

  useEffect(() => {
    getProposalDraft();
  }, []);

  useEffect(() => {
    if (loadingProposal === false) setLoadingField('');
  }, [loadingProposal]);

  const disabledSubmitButton = useMemo(() => {
    if (
      !identification ||
      !numberOfInstallments ||
      !firstDueDate ||
      Object.keys(errors).length > 0 ||
      (!isAutomaticPolicy && proposalDocuments.length === 0) ||
      loadingQuote ||
      loadingProposal ||
      (userProfile === ProfileEnum.COMMERCIAL &&
        isAutomaticPolicy &&
        ((typeOfAuthorization === 'hasAuthorization' &&
          documentsForAuthorization.length === 0) ||
          (typeOfAuthorization === 'sendToApproval' &&
            approvalContacts.length === 0)))
    ) {
      return true;
    }
    return false;
  }, [
    firstDueDate,
    identification,
    isAutomaticPolicy,
    numberOfInstallments,
    proposalDocuments,
    errors,
    loadingQuote,
    loadingProposal,
    typeOfAuthorization,
    approvalContacts,
    documentsForAuthorization,
  ]);

  const getProposalDraft = useCallback(() => {
    if (!identification?.PolicyId) return;
    ProposalApi.getProposalDraft(identification.PolicyId)
      .then(response => {
        setProposalDraft(response.draftLink);
      })
      .catch(error => makeToast('error', handleError(error)));
  }, [identification]);

  const handleComments = (comments: string) => {
    dispatch(setComments(comments));
  };

  const handleCommentsBlur = (value: string) => {
    if (currentProposal?.observations !== value) {
      setLoadingField('comments');
      updateProposal();
    }
  };

  const handleCertificateRegularity = () => {
    window.open(`${process.env.NX_GLOBAL_CERTIFICATE_REGULARITY}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAutomaticPolicy && userProfile === ProfileEnum.COMMERCIAL) {
      setOpenModal('commercialAuthorization');
      return;
    }
    if (hasOnlyFinancialPending) history.push('/financial-pending');
    createIssuanceOrSubmitToApproval(name);
  };

  const renderProposalDocuments = () => {
    if (isAutomaticPolicy) return null;
    return <ProposalDocuments />;
  };

  const renderComments = () => {
    if (loadingField === 'comments' && loadingProposal) {
      return <Skeleton height={109} width="100%" />;
    }
    return (
      <TextArea
        id="additionalDataForm-text-area-comments"
        data-testid="additionalDataForm-text-area-comments"
        name="additionalDataForm"
        label="Caso necessário, informe particularidades do processo (opcional)"
        placeholder="Exemplo: coberturas adicionais, etc."
        value={comments}
        onChange={e => handleComments(e.target.value)}
        onBlur={e => handleCommentsBlur(e.target.value)}
      />
    );
  };

  const renderCommercialAuthorization = () => {
    if (isAutomaticPolicy && userProfile === ProfileEnum.COMMERCIAL) {
      return <CommercialAuthorization />;
    }
    return null;
  };

  const renderLabelButton = () => {
    let label = 'Emitir';
    if (!isAutomaticPolicy) label = 'Finalizar inclusão';
    if (
      (userProfile === ProfileEnum.COMMERCIAL &&
        isAutomaticPolicy &&
        typeOfAuthorization === 'sendToApproval') ||
      (userProfile === ProfileEnum.POLICYHOLDER &&
        !BrokerPlatformAuthService.userHasPermission(
          POLICYHOLDER_ISSUE_PERMISSION,
        ))
    )
      label = 'Enviar para aprovação';
    return label;
  };

  return (
    <form
      className={styles['additional-data-form__wrapper']}
      onSubmit={e => handleSubmit(e)}
    >
      {renderProposalDocuments()}
      <PaymentFields />
      <section className={styles['additional-data-form__comments-wrapper']}>
        <p className={styles['additional-data-form__comments-text']}>
          Observações
        </p>
        {renderComments()}
      </section>
      {renderCommercialAuthorization()}
      <DraftDownload
        proposalDraft={proposalDraft}
        isAutomaticPolicy={isAutomaticPolicy}
      />
      <footer className={styles['additional-data-form__footer']}>
        <div className={styles['additional-data-form__footer-link-wrapper']}>
          <LinkButton
            id="additionalDataForm-certificate-regularity-button"
            data-testid="additionalDataForm-certificate-regularity-button"
            onClick={() => handleCertificateRegularity()}
            label="Certificado de regularidade"
            icon="download"
            iconPosition="left"
          />
          <LinkButton
            id="additionalDataForm-terms-modal-button"
            data-testid="additionalDataForm-terms-modal-button"
            onClick={() => setOpenModal('terms')}
            label="Termos e condições"
            icon="download"
            iconPosition="left"
          />
        </div>
        <Button
          id="additionalDataForm-submit-button"
          data-testid="additionalDataForm-submit-button"
          type="submit"
          size="large"
          disabled={disabledSubmitButton}
          loading={loadingIssuance}
        >
          {renderLabelButton()}
        </Button>
        <TermsOfAcceptanceModal
          isModalOpen={openModal === 'terms'}
          onToggleModal={setOpenModal}
        />
        <CommercialAuthorizationModal
          isModalOpen={openModal === 'commercialAuthorization'}
          onToggleModal={setOpenModal}
          onConfirm={() => createIssuanceOrSubmitToApproval(name)}
          modalType={typeOfAuthorization}
        />
      </footer>
    </form>
  );
};

export default AdditionalDataForm;
