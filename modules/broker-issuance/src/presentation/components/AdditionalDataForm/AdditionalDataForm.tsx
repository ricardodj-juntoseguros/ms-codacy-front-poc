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
import { GenericComponentProps, useFlow } from '@shared/hooks';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { useProposal } from '../../hooks';
import IssuanceApi from '../../../application/features/issuance/IssuanceApi';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import handleError from '../../../helpers/handlerError';
import { selectProposalDocuments } from '../../../application/features/proposalDocuments/ProposalDocumentsSlice';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import TermsOfAcceptanceModal from '../TermsOfAcceptanceModal';
import PaymentFields from '../PaymentFields';
import UploadDocuments from '../UploadDocuments';
import styles from './AdditionalDataForm.module.scss';
import DraftDownload from '../DraftDownload';

const AdditionalDataForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  const [loadingField, setLoadingField] = useState('');
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [proposalDraft, setProposalDraft] = useState<string>('');
  const [loadingIssuance, setLoadingIssuance] = useState(false);
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
  const updateProposal = useProposal();
  const history = useHistory();
  const { advanceStep } = useFlow();
  const { setComments } = proposalActions;

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
      loadingProposal
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
  ]);

  const getProposalDraft = useCallback(() => {
    if (!identification?.PolicyId) return;
    ProposalApi.getProposalDraft(identification.PolicyId)
      .then(response => {
        setProposalDraft(response.draftLink);
      })
      .catch(error => makeToast('error', handleError(error)));
  }, [identification]);

  const postIssuance = useCallback(() => {
    setLoadingIssuance(true);
    if (!identification?.PolicyId) return;
    IssuanceApi.postIssuance(identification.PolicyId)
      .then(response => {
        advanceStep(name);
        response.issued ? history.push('/success') : history.push('/analysis');
      })
      .catch(error => makeToast('error', handleError(error)))
      .finally(() => setLoadingIssuance(false));
  }, [advanceStep, history, identification, name]);

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
    if (hasOnlyFinancialPending) history.push('/financial-pending');
    postIssuance();
  };

  const renderUploadDocuments = () => {
    if (isAutomaticPolicy) return null;
    return <UploadDocuments />;
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

  return (
    <form
      className={styles['additional-data-form__wrapper']}
      onSubmit={e => handleSubmit(e)}
    >
      {renderUploadDocuments()}
      <PaymentFields />
      <section className={styles['additional-data-form__comments-wrapper']}>
        <p className={styles['additional-data-form__comments-text']}>
          Observações
        </p>
        {renderComments()}
      </section>
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
            onClick={() => setOpenTermsModal(true)}
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
          {isAutomaticPolicy ? 'Emitir' : 'Finalizar inclusão'}
        </Button>
        <TermsOfAcceptanceModal
          isModalOpen={openTermsModal}
          onToggleModal={setOpenTermsModal}
        />
      </footer>
    </form>
  );
};

export default AdditionalDataForm;
