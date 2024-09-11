import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
  useContext,
} from 'react';
import {
  Button,
  Dropdown,
  LinkButton,
  NumberInput,
  ThemeContext,
  Toggle,
  Tooltip,
} from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import className from 'classnames';
import { useNavigate } from 'react-router-dom';
import { flowActions } from '../../../application/features/flow/FlowSlice';
import {
  fetchModalities,
  selectModalitySelection,
} from '../../../application/features/ModalitySelection/ModalitySelectionSlice';
import {
  selectValidation,
  validationActions,
} from '../../../application/features/validation/ValidationSlice';
import { WarrantyDataSchema } from '../../../application/validations/schemas';
import {
  GenericComponentProps,
  ModalityModel,
  ValidationTypesEnum,
} from '../../../application/types/model';
import styles from './WarrantyData.module.scss';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { useCreateProposal, useValidate } from '../../hooks';
import ModalitiesInformationModal from '../ModalitiesInformationModal';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import WarrantyDataCoverageValue from '../WarrantyDataCoverageValue/WarrantyDataCoverageValue';
import ValidityFields from '../ValidityFields/ValidityFields';
import { AppDispatch } from '../../../config/store';

const WarrantyData: React.FunctionComponent<GenericComponentProps> = () => {
  const proposal = useSelector(selectProposal);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const theme = useContext(ThemeContext);
  const {
    initialValidity,
    endValidity,
    validityInDays,
    warrantyPercentage,
    insuredFederalId,
    modality,
    additionalCoverageLabor,
    totalValue,
    createProposalSuccess,
  } = proposal;
  const { modalityOptionsMapped } = useSelector(selectModalitySelection);
  const { errors } = useSelector(selectValidation);
  const dispatch: AppDispatch = useDispatch();
  const validate = useValidate();
  const createProposal = useCreateProposal();
  const [openModal, setOpenModal] = useState(false);
  const [proposalLoading, setProposalLoading] = useState(false);
  const navigate = useNavigate();

  const disabledButton = useMemo(
    () =>
      !initialValidity ||
      !endValidity ||
      !validityInDays ||
      !warrantyPercentage ||
      Object.keys(modality).length === 0 ||
      Object.keys(errors).length !== 0,
    [
      endValidity,
      errors,
      initialValidity,
      modality,
      validityInDays,
      warrantyPercentage,
    ],
  );

  useEffect(() => {
    if (createProposalSuccess) navigate('/summary');
  }, [createProposalSuccess, navigate]);

  useEffect(() => {
    dispatch(validationActions.setIsValidForm(false));
  }, [dispatch]);

  useEffect(() => {
    const getModalities = () => {
      if (insuredFederalId) dispatch(fetchModalities(insuredFederalId));
    };

    getModalities();
  }, [dispatch, insuredFederalId]);

  const handleWarrantyPercentage = (value: number) => {
    dispatch(proposalActions.setWarrantyPercentage(value));
  };

  const handleModality = (modality: ModalityModel) => {
    dispatch(proposalActions.setModality(modality));
    dispatch(validationActions.removeErrorMessage('modality'));
  };

  const handleAdditionalCoverageLabor = useCallback(
    (additionalCoverageLabor: boolean) => {
      dispatch(
        proposalActions.setAdditionalCoverageLabor(additionalCoverageLabor),
      );
    },
    [dispatch],
  );

  const validateFields = async (fieldName: string) => {
    await validate(
      WarrantyDataSchema,
      proposal,
      ValidationTypesEnum.partial,
      [fieldName],
      false,
    );
  };

  const renderTooltip = useCallback(() => {
    return (
      <>
        <button
          type="button"
          data-testid="warranty-data-button-tooltip"
          ref={tooltipButtonRef}
          className={styles['warranty-data__tooltip-button']}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <i className={className('icon', 'icon-help-circle', styles[theme])} />
        </button>
        <Tooltip
          anchorRef={tooltipButtonRef}
          text="Nessa modalidade é possível contratar uma cobertura adicional para risco Trabalhista e Previdenciário, que garante o pagamento ao segurado de prejuízos referente a ações trabalhistas decorrentes do contrato firmado."
          visible={tooltipVisible}
          position="top"
        />
      </>
    );
  }, [theme, tooltipVisible]);

  const renderCoverageLaborField = useMemo(() => {
    if (!modality || !modality.allowsAdditionalCoverageLabor) {
      handleAdditionalCoverageLabor(false);
      return null;
    }

    return (
      <div className={styles['warranty-data__coverage-labor']}>
        <Toggle
          data-testid="warrantyData-toogle-additional-coverage"
          checked={additionalCoverageLabor}
          name="additionalCoverageLabor"
          label="A cláusula de garantia do contrato exige cobertura Trabalhista e Previdenciária?"
          onChange={() =>
            handleAdditionalCoverageLabor(!additionalCoverageLabor)
          }
        />
        {renderTooltip()}
      </div>
    );
  }, [
    additionalCoverageLabor,
    handleAdditionalCoverageLabor,
    modality,
    renderTooltip,
  ]);

  const renderWarrantyDataConverageValue = () => {
    if (!totalValue || warrantyPercentage > 100) {
      return null;
    }

    return <WarrantyDataCoverageValue totalValue={totalValue} />;
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setProposalLoading(true);

      const result = await createProposal();
      setProposalLoading(false);
      if (
        !result.success &&
        Object.keys(result.errors).includes('policyholderInputValue')
      ) {
        dispatch(validationActions.setErrorMessages(result.errors));
        dispatch(
          flowActions.setEditableStep('InsuredAndPolicyholderSelection'),
        );
      }
    },
    [createProposal, dispatch],
  );

  return (
    <form
      className={styles['warranty-data__wrapper']}
      onSubmit={e => handleSubmit(e)}
    >
      <ValidityFields validationSchema={WarrantyDataSchema} />

      <NumberInput
        data-testid="warrantyData-input-warranty-percentage"
        label="Percentual da garantia exigido"
        placeholder="0%"
        minValue={1}
        maxValue={100}
        maxLength={4}
        suffix="%"
        onChange={handleWarrantyPercentage}
        onBlur={() => validateFields('warrantyPercentage')}
        value={warrantyPercentage}
        allowNegative={false}
        errorMessage={
          errors.warrantyPercentage ? errors.warrantyPercentage[0] : ''
        }
      />
      <Dropdown
        data-testid="warrantyData-dropdown-modality"
        placeholder=" "
        label="Tipo de seguro garantia"
        options={modalityOptionsMapped}
        errorMessage={errors.modality ? errors.modality[0] : ''}
        onValueSelected={handleModality}
        value={modality}
      />
      <LinkButton
        data-testid="warrantyData-link-button-modality-information"
        onClick={() => setOpenModal(true)}
        label="Não sei qual escolher"
      />

      {renderCoverageLaborField}

      {renderWarrantyDataConverageValue()}

      <ModalitiesInformationModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalityOptionsMapped={modalityOptionsMapped}
      />

      <Button
        type="submit"
        fullWidth
        disabled={disabledButton}
        data-testid="warrantyData-button-next"
      >
        {proposalLoading ? ((<LoadingSpinner />) as any) : 'Avançar'}
      </Button>
    </form>
  );
};

export default WarrantyData;
