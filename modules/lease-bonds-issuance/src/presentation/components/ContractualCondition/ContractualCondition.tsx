import { FunctionComponent, useEffect } from 'react';
import {
  Alert,
  RadioGroup,
  TextArea,
  Toggle,
  RadioButton,
} from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import {
  contractualConditionActions,
  getCustomClause,
  patchCustomClause,
  selectContractualCondition,
} from '../../../application/features/contractualCondition/ContractualConditionSlice';
import { DISCLAIMERS } from '../../../constants';
import { CustomClauseRequestedByEnum } from '../../../application/types/model';
import { AppDispatch } from '../../../config/store';
import {
  canAuthorizeProposal,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import ContractualConditionSkeleton from '../Skeletons/ContractualConditionSkeleton';
import styles from './ContractualCondition.module.scss';

const ContractualCondition: FunctionComponent = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    currentContractualCondition,
    requestedBy,
    text,
    openContractualConditions,
    loadingContractualCondition,
  } = useSelector(selectContractualCondition);
  const { policyholder } = useSelector(selectQuote);
  const { setOpenContractualConditions, setRequestedBy, setText } =
    contractualConditionActions;
  const { identification, loadingProposal } = useSelector(selectProposal);

  useEffect(() => {
    if (identification && identification.PolicyId) {
      dispatch(getCustomClause(identification.PolicyId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const removeContractualConditions = () => {
      if (!currentContractualCondition) return;
      dispatch(
        patchCustomClause({
          clauseId: currentContractualCondition.id,
          text,
          requestedBy: requestedBy || currentContractualCondition.requestedBy,
          isDelete: true,
        }),
      ).then(
        () =>
          identification &&
          dispatch(
            canAuthorizeProposal({ policyId: identification?.PolicyId }),
          ),
      );
    };
    if (!openContractualConditions) removeContractualConditions();
  }, [
    currentContractualCondition,
    dispatch,
    identification,
    openContractualConditions,
    requestedBy,
    text,
  ]);

  const handleToogleContractualConditions = () => {
    dispatch(setOpenContractualConditions(!openContractualConditions));
  };

  const handleRequestedBy = (value: string) => {
    dispatch(setRequestedBy(value));
  };

  const handleContractualConditionsChange = (value: string) => {
    dispatch(setText(value));
  };

  const renderContractualCondition = () => {
    if (!policyholder) return null;
    const {
      disabledFeatures: { customClauses },
    } = policyholder;
    if (customClauses) return null;
    if (loadingProposal || loadingContractualCondition)
      return <ContractualConditionSkeleton />;
    if (!identification?.PolicyId) return null;
    return (
      <>
        <Toggle
          id="contractualConditions-toggle-show"
          data-testid="contractualConditions-toggle-show"
          label="Alterar condições contratuais da proposta"
          name="contractualConditions-toggle-show"
          checked={openContractualConditions}
          onChange={handleToogleContractualConditions}
        />
        {openContractualConditions && (
          <div className={styles['contractual-conditions__content']}>
            <Alert
              variant="info"
              text={DISCLAIMERS.newContractualConditions}
              fullWidth
            />
            <div className={styles['contractual-conditions__radio-wrapper']}>
              <p className={styles['contractual-conditions__text']}>
                A nova condição foi uma iniciativa do:
              </p>
              <RadioGroup
                name="requestedBy"
                value={`${requestedBy}`}
                onChange={v => handleRequestedBy(v)}
              >
                <div
                  className={styles['contractual-conditions__radio-wrapper']}
                >
                  <RadioButton
                    id="contractualConditions-policyholder-radio-button"
                    data-testid="contractualConditions-policyholder-radio-button"
                    value={`${CustomClauseRequestedByEnum.POLICYHOLDER}`}
                    label="Tomador"
                  />
                  <RadioButton
                    id="contractualConditions-insured-radio-button"
                    data-testid="contractualConditions-insured-radio-button"
                    value={`${CustomClauseRequestedByEnum.INSURED}`}
                    label="Segurado"
                  />
                </div>
              </RadioGroup>
            </div>
            <TextArea
              id="contractualConditions-text-area"
              data-testid="contractualConditions-text-area"
              name="contractualConditions"
              label="Insira o texto da nova condição."
              placeholder=""
              value={text}
              onChange={e => handleContractualConditionsChange(e.target.value)}
            />
            <div className={styles['contractual-conditions__legal-terms']}>
              <h3
                className={styles['contractual-conditions__legal-terms-title']}
              >
                <i className="icon icon-alert-circle" />
                Importante
              </h3>
              <p
                className={
                  styles['contractual-conditions__legal-terms-content']
                }
              >
                {DISCLAIMERS.resolutionCNSP382}
              </p>
            </div>
          </div>
        )}
      </>
    );
  };

  return renderContractualCondition();
};

export default ContractualCondition;
