import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Upload,
  UploadFile,
  UploadListFiles,
  Button,
  makeToast,
  LinkButton,
} from 'junto-design-system';
import styles from './UploadDocuments.module.scss';
import BrokerUploadDocumentApi from '../../../application/features/BrokerUploadDocument/BrokerUploadDocumentApi';
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { FOLDERS_UPLOAD_DOCUMENTS } from '../../../constants/foldersUploadDocuments';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import LoadingSpinner from '../LoadingSpinner';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';
import { TextHelper } from '../TextHelper';

export interface UploadDocumentsProps {
  handleGoNextClick(): void;
}

export function UploadDocuments({ handleGoNextClick }: UploadDocumentsProps) {
  const types = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/tiff',
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const [contractSocial, setContractSocial] = useState<UploadFile[]>([]);
  const [proofAddress, setProofAddress] = useState<UploadFile[]>([]);
  const [proofBankDetails, setProofBankDetails] = useState<UploadFile[]>([]);
  const [isDisableGoNextStep, setIsDisableGoNextStep] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const brokerInformation = useSelector(selectBroker);
  const [fileNameProofBankDetails, setfileNameProofBankDetails] =
    useState<string>();
  const [fileNameProofAddress, setfileNameProofAddress] = useState<string>();
  const [fileNameContractSocial, setfileNameContractSocial] =
    useState<string>();
  const sreenWidth = window.screen.width;
  const [showTextHelper, setShowTextHelper] = useState(sreenWidth > 680);
  const textHelper = [
    'Garanta que os documentos estejam legíveis e atualizados (no máximo 10 anos).',
    'Cada arquivo não pode ultrapassar o tamanho de 25 MB.',
    'O comprovante dos dados bancários pode ser a imagem do cartão ou a tela do aplicativo do banco.',
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const hasNotDocumentsEmpty =
      contractSocial.length > 0 &&
      proofAddress.length > 0 &&
      proofBankDetails.length > 0;
    if (hasNotDocumentsEmpty) {
      setIsDisableGoNextStep(false);
    } else {
      setIsDisableGoNextStep(true);
    }
  }, [contractSocial.length, proofAddress.length, proofBankDetails.length]);

  const handleRemoveFileContractSocial = (id: string) => {
    setContractSocial([...contractSocial.filter(file => file.id !== id)]);
  };

  const handleRemoveFileProofAddress = (id: string) => {
    setProofAddress([...proofAddress.filter(file => file.id !== id)]);
  };

  const handleRemoveFileProofBankDetails = (id: string) => {
    setProofBankDetails([...proofBankDetails.filter(file => file.id !== id)]);
  };

  const handleUploadContractSocial = (items: UploadFile[]) => {
    setContractSocial(items);
  };

  const handleUploadProofAddress = (items: UploadFile[]) => {
    setProofAddress(items);
  };

  const handleUploadProofBankDetails = (items: UploadFile[]) => {
    setProofBankDetails(items);
  };

  const fetchUploadDocumentContractSocial = async (item: File) => {
    await BrokerUploadDocumentApi.sendUploadFile(
      FOLDERS_UPLOAD_DOCUMENTS.contractSocial,
      brokerInformation.pathUpdate,
      item,
    )
      .then(async response => {
        const fileName = response.urlLocation.split('/');
        setfileNameContractSocial(fileName[4]);
      })
      .catch(() => {
        setIsSubmitting(false);
        makeToast('error', VALIDATION_MESSAGES.errorMessage);
      })
      .finally(() => fetchUploadDocumentProofAddress(proofAddress[0].file));
  };

  const fetchUploadDocumentProofAddress = async (item: File) => {
    await BrokerUploadDocumentApi.sendUploadFile(
      FOLDERS_UPLOAD_DOCUMENTS.proofAddress,
      brokerInformation.pathUpdate,
      item,
    )
      .then(response => {
        const fileName = response.urlLocation.split('/');
        setfileNameProofAddress(fileName[4]);
      })
      .catch(() => {
        setIsSubmitting(false);
        makeToast('error', VALIDATION_MESSAGES.errorMessage);
      })
      .finally(() =>
        fetchUploadDocumentProofBankDetails(proofBankDetails[0].file),
      );
  };

  const fetchUploadDocumentProofBankDetails = async (item: File) => {
    await BrokerUploadDocumentApi.sendUploadFile(
      FOLDERS_UPLOAD_DOCUMENTS.proofBankDetails,
      brokerInformation.pathUpdate,
      item,
    )
      .then(response => {
        const fileName = response.urlLocation.split('/');
        setfileNameProofBankDetails(fileName[4]);
      })
      .catch(() => {
        setIsSubmitting(false);
        makeToast('error', VALIDATION_MESSAGES.errorMessage);
      });
  };

  useEffect(() => {
    if (
      fileNameContractSocial &&
      fileNameProofAddress &&
      fileNameProofBankDetails
    ) {
      fetchRegisterResponsibleBroker();
    }
  }, [fileNameContractSocial, fileNameProofAddress, fileNameProofBankDetails]);

  const fetchRegisterResponsibleBroker = async () => {
    const payload = [
      {
        op: 'replace',
        path: '/socialDocumentation',
        value: fileNameContractSocial,
      },
      {
        op: 'replace',
        path: '/addressDocumentation',
        value: fileNameProofAddress,
      },
      {
        op: 'replace',
        path: '/bankDocumentation',
        value: fileNameProofBankDetails,
      },
    ];
    await RegisterBrokerApi.updateRegisterBroker(
      [...payload],
      brokerInformation.pathUpdate,
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsDisableGoNextStep(true);
    await fetchUploadDocumentContractSocial(contractSocial[0].file);
  };

  return (
    <>
      <div className={styles['uploader__wrapper']}>
        <div className={styles['uploader__title']}>
          <h1>Envio de documentos</h1>
          <span>
            Mande os documentos da corretora para finalizar o cadastro:
          </span>
        </div>
        <span className={styles['uploader__label']}>
          Comprovante de endereço
        </span>
        <div className={styles['uploader__field']}>
          <Upload
            data-testid="proof-address"
            fullWidth={false}
            maxFileSize={25}
            multipleFiles={false}
            onCallbackUpload={handleUploadProofAddress}
            types={types}
            errorMessage={VALIDATION_MESSAGES.typeDocument}
            showMaxFileSize={false}
          />
        </div>
        {proofAddress.length > 0 && (
          <div className={styles['uploader__list']}>
            <UploadListFiles
              data-testid="proof-address-list"
              items={proofAddress}
              onCallbackRemove={handleRemoveFileProofAddress}
            />
          </div>
        )}
        <span className={styles['uploader__label']}>Comprovante bancário</span>
        <span className={styles['uploader__helper-text']}>
          Insira a imagem do cartão ou tela do aplicativo do banco para
          validação das informações bancárias da corretora.
        </span>
        <div className={styles['uploader__field']}>
          <Upload
            data-testid="proof-bank-details"
            fullWidth={false}
            maxFileSize={25}
            multipleFiles={false}
            onCallbackUpload={handleUploadProofBankDetails}
            types={types}
            errorMessage={VALIDATION_MESSAGES.typeDocument}
            showMaxFileSize={false}
          />
        </div>
        {proofBankDetails.length > 0 && (
          <div className={styles['uploader__list']}>
            <UploadListFiles
              data-testid="proof-bank-details-list"
              items={proofBankDetails}
              onCallbackRemove={handleRemoveFileProofBankDetails}
            />
          </div>
        )}
        <span className={styles['uploader__label']}>
          Contrato Social ou Alteração Contratual
        </span>
        <span className={styles['uploader__helper-text']}>
          Envie o documento atualizado e que não tenha mais de 10 anos.
        </span>
        <div className={styles['uploader__field']}>
          <Upload
            data-testid="contract-social"
            fullWidth={false}
            maxFileSize={25}
            multipleFiles={false}
            onCallbackUpload={handleUploadContractSocial}
            types={types}
            errorMessage={VALIDATION_MESSAGES.typeDocument}
            showMaxFileSize={false}
          />
        </div>
        {contractSocial.length > 0 && (
          <div className={styles['uploader__list']}>
            <UploadListFiles
              data-testid="contract-social-list"
              items={contractSocial}
              onCallbackRemove={handleRemoveFileContractSocial}
            />
          </div>
        )}
        <div className={styles['uploader__button']}>
          <Button
            data-testid="button-broker-upload"
            onClick={handleSubmit}
            disabled={isDisableGoNextStep}
          >
            {isSubmitting ? ((<LoadingSpinner />) as any) : 'Enviar documentos'}
          </Button>
        </div>
        {sreenWidth <= 680 && (
          <div className={styles['uploader__show-text-helper']}>
            <LinkButton
              onClick={() => setShowTextHelper(!showTextHelper)}
              label="Instruções para envio de documentos"
              icon={!showTextHelper ? 'help-circle' : 'chevron-up'}
              iconPosition="left"
            />
          </div>
        )}
      </div>
      {showTextHelper && (
        <TextHelper
          title="Instruções para envio de documentos"
          text={textHelper}
        />
      )}
    </>
  );
}

export default UploadDocuments;
