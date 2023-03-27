/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Upload,
  UploadFile,
  UploadListFiles,
  Button,
} from 'junto-design-system';
import { it } from 'date-fns/locale';
import styles from './UploadDocuments.module.scss';
import  BrokerUploadDocumentApi from '../../../application/features/BrokerUploadDocument/BrokerUploadDocumentApi'
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { FOLDERS_UPLOAD_DOCUMENTS } from '../../../constants/foldersUploadDocuments';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import LoadingSpinner from '../LoadingSpinner';

export interface UploadDocumentsProps {
  handleGoNextClick(): void;
}


export function UploadDocuments({handleGoNextClick}: UploadDocumentsProps) {
  const types = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  const [contractSocial, setContractSocial] = useState<UploadFile[]>([]);
  const [proofAddress, setProofAddress] = useState<UploadFile[]>([]);
  const [proofBankDetails, setProofBankDetails] = useState<UploadFile[]>([]);
  const [isDisableGoNextStep, setIsDisableGoNextStep] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const brokerInformation = useSelector(selectBroker);


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const hasNotDocumentsEmpty = contractSocial.length > 0 && proofAddress.length > 0 && proofBankDetails.length > 0
    if(hasNotDocumentsEmpty){
     setIsDisableGoNextStep(false);
    }
    else{
      setIsDisableGoNextStep(true);
    }
  }, [contractSocial.length, proofAddress.length, proofBankDetails.length]);


  const handleRemoveFileContractSocial =  (id: string) => {
    setContractSocial([...contractSocial.filter(file => file.id !== id)]);
  };

  const handleRemoveFileProofAddress =  (id: string) => {
    setProofAddress([...proofAddress.filter(file => file.id !== id)]);
  };

  const handleRemoveFileProofBankDetails =  (id: string) => {
    setProofBankDetails([...proofBankDetails.filter(file => file.id !== id)]);
  };

  const handleUploadContractSocial = (items: UploadFile[]) => {
    setContractSocial([...contractSocial.concat(items)]);
  };


  const handleUploadProofAddress = (items: UploadFile[]) => {
    setProofAddress([...proofAddress.concat(items)]);
  };

  const handleUploadProofBankDetails = (items: UploadFile[]) => {
    setProofBankDetails([...proofBankDetails.concat(items)]);

  };

  const fetchUploadFileContractSocial = async (items: UploadFile[]) => {
    items.map(async item => {
          await BrokerUploadDocumentApi.sendUploadFile(FOLDERS_UPLOAD_DOCUMENTS.contractSocial,brokerInformation.pathUpdate,item.file)
          .then(() =>{
            if(items[items.length -1] === item){
              fetchUploadFileProofAddress(proofAddress)
            }
          })
          .catch(() => setIsSubmitting(false))
     })
  };

  const fetchUploadFileProofAddress = async (items: UploadFile[]) => {
    items.map(async item => {
          await BrokerUploadDocumentApi.sendUploadFile(FOLDERS_UPLOAD_DOCUMENTS.proofAddress ,brokerInformation.pathUpdate,item.file)
          .then(() =>{
            if(items[items.length -1] === item){
              fetchUploadFileProofBankDetails(proofBankDetails)
            }
          })
          .catch(() => setIsSubmitting(false))
     })
  };


  const fetchUploadFileProofBankDetails = async (items: UploadFile[]) => {
    items.map(async item => {
          await BrokerUploadDocumentApi.sendUploadFile(FOLDERS_UPLOAD_DOCUMENTS.proofBankDetails,brokerInformation.pathUpdate,item.file)
          .then(() =>{
            if(items[items.length -1] === item){
              setIsSubmitting(false);
              setIsDisableGoNextStep(false);
              handleGoNextClick();
            }
          })
          .catch(() => setIsSubmitting(false))
     })
  };



  const handleSubmit = async () => {
   setIsSubmitting(true);
   setIsDisableGoNextStep(true);
   await fetchUploadFileContractSocial(contractSocial)
  };

  return (
    <div className={styles['uploader__wrapper']}>
      <span className={styles['upload_label']}>Contrato Social ou Alteração Contratual</span>
      <div className={styles['upload_field']}>
      <Upload
        data-testid="contract-social"
        fullWidth={false}
        maxFileSize={10}
        multipleFiles={false}
        onCallbackUpload={handleUploadContractSocial}
        types={types}
        errorMessage={VALIDATION_MESSAGES.typeDocument}
        showMaxFileSize={false}
        helperMessage="O documento deve estar atualizado (no máximo 10 anos)."
        />
    </div>
    {contractSocial.length > 0 && (
        <div className={styles['uploader__list']}>
          <UploadListFiles
            data-testid="contract-social-list"
            items={contractSocial}
            onCallbackRemove={handleRemoveFileContractSocial} />

        </div>
      )}
    <span className={styles['upload_label']}>Comprovante de endereço</span>
    <div className={styles['upload_field']} >
        <Upload
          data-testid='proof-address'
          fullWidth={false}
          maxFileSize={10}
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
              data-testid='proof-address-list'
              items={proofAddress}
              onCallbackRemove={handleRemoveFileProofAddress} />

          </div>
        )}
      <span className={styles['upload_label']}>Comprovante dos dados bancários</span>
      <div className={styles['upload_field']}>
        <Upload
          data-testid='proof-bank-details'
          fullWidth={false}
          maxFileSize={10}
          multipleFiles={false}
          onCallbackUpload={handleUploadProofBankDetails}
          types={types}
          errorMessage={VALIDATION_MESSAGES.typeDocument}
          showMaxFileSize={false}
          helperMessage="Insira a imagem do cartão ou tela do aplicativo do banco para validação das informações bancárias."
          />
      </div>
      {proofBankDetails.length > 0 && (
          <div className={styles['uploader__list_proof-bank']}>
            <UploadListFiles
              data-testid='proof-bank-details-list'
              items={proofBankDetails}
              onCallbackRemove={handleRemoveFileProofBankDetails} />
          </div>
        )}
      <div className={styles['broker_upload__button']}>
        <Button
        data-testid="button-broker-upload"
        onClick={handleSubmit}
        disabled={isDisableGoNextStep}
        >
         {isSubmitting
                ? ((<LoadingSpinner />) as any)
                : "Enviar"}
        </Button>
      </div>
    </div>
  );
}

export default UploadDocuments;
