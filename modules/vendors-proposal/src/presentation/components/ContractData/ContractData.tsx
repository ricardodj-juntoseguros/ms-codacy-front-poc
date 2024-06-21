import {
  Button,
  CurrencyInput,
  InputBase,
  Upload,
  UploadListFiles,
  Toggle,
  Tooltip,
  ThemeContext,
  SearchInput,
  SearchOptions,
} from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { currencyFormatter, thousandSeparator } from '@shared/utils';
import className from 'classnames';
import {
  fetchProjects,
  projectSelectionActions,
  selectProjectSelection,
} from '../../../application/features/projectSelection/ProjectSelectionSlice';
import { GenericComponentProps } from '../../../application/types/model';
import { ContractDataSchema } from '../../../application/validations/schemas';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { MIME_TYPES } from '../../../constants';
import { useValidate } from '../../hooks';
import { useFiles } from '../../../config/filesContext';

import styles from './ContractData.module.scss';
import { selectValidation } from '../../../application/features/validation/ValidationSlice';

const ContractData: React.FunctionComponent<GenericComponentProps> = ({
  handleNextStep,
}) => {
  const { errors } = useSelector(selectValidation);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const { contractNumber, contractValue, hasProject, project } =
    useSelector(selectProposal);
  const { projectSearchValue, projectOptions, projectOptionsFiltered } =
    useSelector(selectProjectSelection);
  const { handleSetFiles, deleteFile, files } = useFiles();
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const validate = useValidate();

  useEffect(() => {
    const getProjects = async () => {
      await dispatch(fetchProjects(''));
    };

    if (projectOptions.length === 0 && projectSearchValue === '') getProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disabledButton = useMemo(
    () => !contractNumber || !contractValue || files.length <= 0,
    [contractNumber, contractValue, files.length],
  );

  const handleContractNumber = (number: string) => {
    dispatch(proposalActions.setContractNumber(number));
  };

  const handleContractValue = (value: number) => {
    dispatch(proposalActions.setContractValue(value));
  };

  const handleHasProject = () => {
    dispatch(proposalActions.setHasProject(!hasProject));
  };

  const handleProject = (project: SearchOptions | null) => {
    dispatch(proposalActions.setProject(project));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      contractNumber,
      contractValue,
      files,
      hasProject,
      projectOptionsFiltered,
      projectSearchValue,
      project,
    };
    const result = await validate(ContractDataSchema, payload);
    if (!result) return;

    handleNextStep(`${contractNumber} - ${currencyFormatter(contractValue)}`);
  };

  const handleSearchProjects = (value: string) => {
    if (project && project?.label !== value) handleProject(null);
    dispatch(projectSelectionActions.setProjectSearchValue(value));
  };

  const renderTooltip = () => {
    return (
      <>
        <button
          type="button"
          data-testid="contract-data-button-tooltip"
          ref={tooltipButtonRef}
          className={styles['contract-data__tooltip-button']}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <i className={className('icon', 'icon-help-circle', styles[theme])} />
        </button>
        <Tooltip
          anchorRef={tooltipButtonRef}
          text="Você pode vincular este contrato a algum projeto já existente ou criar um novo projeto para este contrato."
          visible={tooltipVisible}
          position="top"
        />
      </>
    );
  };

  const renderProjectInput = () => {
    if (hasProject) {
      let error = errors.project ? errors.project[0] : '';
      error = errors.projectSearchValue ? errors.projectSearchValue[0] : error;

      return (
        <SearchInput
          data-testid="contract-data-input-project-name"
          label="Informe o nome do projeto"
          placeholder="Ex. Construção da ponte Rio-Niterói"
          icon=""
          value={projectSearchValue}
          options={projectOptionsFiltered}
          changeValueOnSelect
          onChange={value => handleSearchProjects(value)}
          onValueSelected={handleProject}
          onFocus={e => e.target.select()}
          errorMessage={error}
        />
      );
    }
    return null;
  };

  return (
    <form
      className={styles['contract-data__wrapper']}
      onSubmit={e => handleSubmit(e)}
    >
      <InputBase
        data-testid="contractData-input-contract-number"
        label="Número do contrato"
        placeholder=" "
        helperMessage="Este é o número que aparecerá no objeto da apólice."
        onChange={e => handleContractNumber(e.target.value)}
        value={contractNumber}
        errorMessage={errors.contractNumber ? errors.contractNumber[0] : ''}
      />
      <CurrencyInput
        data-testid="contractData-input-contract-value"
        label="Valor total do contrato"
        placeholder="R$ 0,00"
        value={contractValue}
        onChange={value => handleContractValue(value)}
        errorMessage={errors.contractValue ? errors.contractValue[0] : ''}
      />

      <div className={styles['contract-data__has-project-container']}>
        <Toggle
          data-testid="contractData-toggle-has-project"
          name="hasProject"
          checked={hasProject}
          onChange={() => handleHasProject()}
          label="Este contrato se refere a um projeto"
        />
        {renderTooltip()}
      </div>

      {renderProjectInput()}

      <div className={styles['contract-data__upload-container']}>
        <p
          className={className(
            styles['contract-data__upload-message'],
            styles[theme],
          )}
        >
          Anexe aqui seu contrato
        </p>
        <Upload
          data-testid="contractData-input-upload-file"
          fullWidth
          maxFileSize={10}
          showMaxFileSize={false}
          multipleFiles
          onCallbackUpload={files => handleSetFiles(files)}
          types={[MIME_TYPES.pdf, MIME_TYPES.png, MIME_TYPES.jpg]}
        />
        <UploadListFiles
          items={files}
          onCallbackRemove={id => deleteFile(id)}
        />
      </div>

      <Button
        data-testid="contractData-button-next"
        type="submit"
        fullWidth
        disabled={disabledButton}
      >
        Avançar
      </Button>
    </form>
  );
};

export default ContractData;
