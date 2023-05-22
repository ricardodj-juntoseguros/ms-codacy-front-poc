import { Button, CurrencyInput, InputBase, Upload, UploadListFiles } from "junto-design-system";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import {thousandSeparator} from '@shared/utils'
import { GenericComponentProps, ValidationErrorModel } from "../../../application/types/model";
import { ContractDataSchema } from "../../../application/validations/schemas";
import { proposalActions, selectProposal } from "../../../application/features/proposal/ProposalSlice";
import { MIME_TYPES } from "../../../constants";
import { useValidate } from "../../hooks";
import { useFiles } from "../../../config/filesContext";

import styles from './ContractData.module.scss';

const ContractData: React.FunctionComponent<GenericComponentProps> = ({ handleNextStep }) => {
  const [errors, setErrors] = useState<ValidationErrorModel>({} as ValidationErrorModel);
  const dispatch = useDispatch();
  const { contractNumber, contractValue } = useSelector(selectProposal);
  const validate = useValidate();
  const { handleSetFiles, deleteFile, files } = useFiles();

  const disabledButton = useMemo(() =>
    (!contractNumber || !contractValue || files.length <= 0),
  [contractNumber, contractValue, files.length]);
  const mimeTypes = useMemo(() => Object.values(MIME_TYPES), []);

  const handleContractNumber = (number: string) => {
    dispatch(proposalActions.setContractNumber(number));
  }

  const handleContractValue = (value: number) => {
    dispatch(proposalActions.setContractValue(value));
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      contractNumber,
      contractValue,
      files
    };
    const result = await validate(ContractDataSchema, payload);
    if(!result.isValidForm) {
      setErrors(result.errors);
      return;
    }

    handleNextStep(`${contractNumber} - R$ ${thousandSeparator(contractValue, '.', 2)}`);
  }

  return(
    <form
      className={styles['contract-data__wrapper']}
      onSubmit={e => handleSubmit(e)}
    >
        <InputBase
          data-testid="contractData-input-contract-number"
          label="Número do contrato"
          placeholder=" "
          helperMessage="Este é o número que aparecerá no objeto da apólice."
          onChange={(e) => handleContractNumber(e.target.value)}
          value={contractNumber}
          errorMessage={errors.contractNumber ? errors.contractNumber[0] : ''}
        />
        <CurrencyInput
          data-testid="contractData-input-contract-value"
          label="Valor total do contrato"
          placeholder="R$ 0,00"
          value={contractValue}
          onChange={(value) => handleContractValue(value)}
          errorMessage={errors.contractValue ? errors.contractValue[0] : ''}
        />

      <div className={styles['contract-data__upload-container']}>
        <p className={styles['contract-data__upload-message']}>
          Anexe aqui seu contrato
        </p>
        <Upload
          data-testid="contractData-input-upload-file"
          fullWidth
          maxFileSize={10}
          showMaxFileSize={false}
          multipleFiles
          onCallbackUpload={(files) => handleSetFiles(files)}
          types={mimeTypes}
        />
        <UploadListFiles
          items={files}
          onCallbackRemove={(id) => deleteFile(id)}
        />
      </div>

      <Button data-testid="contractData-button-next" type="submit" fullWidth disabled={disabledButton}>
        Avançar
      </Button>
    </form>
  )
};

export default ContractData;
