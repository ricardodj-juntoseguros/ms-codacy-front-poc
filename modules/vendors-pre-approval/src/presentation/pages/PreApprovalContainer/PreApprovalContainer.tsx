import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';

import {
  ThemeContext,
  Button,
  LinkButton,
  Modal,
  TextArea,
  makeToast,
} from 'junto-design-system';
import classNames from 'classnames';
import { formatDateString } from '@shared/utils';
import styles from './PreApprovalContainer.module.scss';

import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import MainInfo from '../../components/MainInfo';
import ContractInfo from '../../components/ContractInfo';
import PaymentInfo from '../../components/PaymentInfo';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

import PreApprovalAPI from '../../../application/features/PreApprovalAPI';
import PreApprovalDTO from '../../../application/types/dto/PreApprovalDTO';

import { DECLINE_INFO, ERROR_MESSAGES } from '../../../constants';

const PreApprovalContainer: React.FC = () => {
  const theme = useContext(ThemeContext);
  const history = useHistory();

  const [proposal, setProposal] = useState<PreApprovalDTO>();
  const [firstDueDate, setFirstDueDate] = useState('');
  const [negativeReason, setNegativeReason] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const query = window.location.search;

  const proposalId = Number(
    query.substring(query.indexOf('=') + 1, query.indexOf('&')),
  );

  const guid = query.substring(9, query.length);

  const templateModal = {
    title: {
      value: DECLINE_INFO.title,
      align: 'center' as any,
      fontWeight: 'bold' as any,
    },
    text: { value: DECLINE_INFO.text, align: 'center' as any },
  };

  useEffect(() => {
    if (!proposal) {
      getProposal(proposalId);
    }
  }, [proposal]);

  const getProposal = async (proposalId: number) => {
    setIsVisible(true);
    try {
      const response = (await PreApprovalAPI.getProposal(
        proposalId,
      )) as PreApprovalDTO;

      const startDate = formatDateString(response.startDate, 'dd/MM/yyyy');
      const endDate = formatDateString(response.endDate, 'dd/MM/yyyy');
      const firstDueDate = formatDateString(
        response.pricing.firstDueDate,
        'dd/MM/yyyy',
      );

      setProposal({
        ...response,
        startDate,
        endDate,
      });

      setFirstDueDate(firstDueDate);
    } catch {
      makeToast('error', ERROR_MESSAGES.getProposalError);
    } finally {
      setIsVisible(false);
    }
  };

  const handleToogleModal = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsChanged(false);
    }
  };

  const onChangeTextArea = (value: string) => {
    if (value === '') {
      setIsChanged(true);
      setNegativeReason(value);
    } else {
      setIsChanged(false);
    }
  };

  const approveProposal = async () => {
    setIsLoading(true);

    const payload = {
      GuidCode: guid,
      DocumentNumber: proposalId,
      Approve: true,
      Observation: 'Observation',
      ClientCommunication: false,
      VisaibleCommission: false,
    };

    try {
      await PreApprovalAPI.approveProposal(payload);
      handleRedirectToSucessPage(true);
    } catch (error) {
      makeToast('error', ERROR_MESSAGES.approveError);
    } finally {
      setIsLoading(false);
    }
  };

  const refuseProposal = async () => {
    setIsLoading(true);

    try {
      await PreApprovalAPI.refuseProposal(proposalId, negativeReason);
      handleRedirectToSucessPage(false);
    } catch {
      makeToast('error', ERROR_MESSAGES.refuseError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToSucessPage = (hasApprove: boolean) => {
    history.push({
      pathname: 'success',
      state: hasApprove,
    });
  };

  return (
    <section className={styles['pre-approval__wrapper']}>
      <div className={styles['pre-approval__title']}>
        <span className={styles[theme]}>{`Proposta ${proposalId}`}</span>
        <h1 className={styles[theme]}>Olá, confira e emita a sua proposta.</h1>
      </div>

      {isVisible ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className={styles['pre-approval__section1']}>
            <MainInfo
              policyholder={proposal ? proposal.policyholder.name : ''}
              modality={proposal ? proposal.product.modality : ''}
              totalPremiumValue={proposal ? proposal.pricing.netPrize : 0}
              duration={proposal ? proposal.durationInDays : 0}
              durationStart={proposal ? proposal.startDate : ''}
              durationEnd={proposal ? proposal.endDate : ''}
            />
            <h2 className={styles[theme]}>Informações do contrato</h2>
            <ContractInfo
              number={proposal ? proposal.number : 0}
              securedAmount={proposal ? proposal.securedAmount : 0}
            />
          </div>

          <div className={styles['pre-approval__section2']}>
            <h2 className={styles[theme]}>Condições de Pagamento</h2>
            <PaymentInfo
              numberOfInstallments={
                proposal
                  ? proposal.pricing.selectedInstallmentOption
                      .numberOfInstallments
                  : 0
              }
              installmentsPrize={
                proposal
                  ? proposal.pricing.selectedInstallmentOption.installments[0]
                      .mainValue
                  : 0
              }
              totalPrize={
                proposal
                  ? proposal.pricing.selectedInstallmentOption.totalPrize
                  : 0
              }
              firstDueDate={firstDueDate || ''}
            />

            <div className={styles['pre-approval__btn-container']}>
              <Button
                data-testid="btn-confirm-approve-proposal"
                fullWidth
                onClick={() => {
                  approveProposal();
                }}
              >
                {isLoading ? ((<LoadingSpinner />) as any) : 'Emitir proposta'}
              </Button>
              <LinkButton
                data-testid="btn-refuse-proposal"
                onClick={handleToogleModal}
                label="Não seguir com a emissão"
              />
            </div>
          </div>
          <Modal
            size="large"
            open={isOpen}
            template={templateModal}
            onBackdropClick={() => handleToogleModal()}
            onCloseButtonClick={() => handleToogleModal()}
          >
            <TextArea
              label="Escreva aqui"
              onBlur={event => onChangeTextArea(event.target.value)}
              maxLength={500}
            />
            <br /> <br />
            <Button
              className={styles['pre-approval__refuse-btn']}
              data-testid="btn-confirm-refuse-proposal"
              fullWidth
              disabled={!isChanged}
              onClick={() => refuseProposal()}
            >
              {isLoading ? ((<LoadingSpinner />) as any) : 'Enviar'}
            </Button>
            <LinkButton
              className={classNames(
                styles['pre-approval__refuse-link-btn'],
                styles[theme],
              )}
              data-testid="btn-return-to-proposal"
              size="small"
              label="Voltar para a proposta"
              onClick={() => handleToogleModal()}
            />
          </Modal>
          <span
            className={classNames(
              styles['pre-approval-container__legal'],
              styles[theme],
            )}
          >
            A aceitação do presente risco possui validade de 15 dias.
          </span>
        </>
      )}
    </section>
  );
};

export default PreApprovalContainer;
