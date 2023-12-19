import { FunctionComponent, useEffect } from 'react';
import { Alert, TextArea, Toggle } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import {
  contractualConditionActions,
  patchCustomClause,
  selectContractualCondition,
} from '../../../application/features/contractualCondition/ContractualConditionSlice';
import { DISCLAIMERS } from '../../../constants';
import { CustomClauseRequestedByEnum } from '../../../application/types/model';
import { RadioButton } from '../RadioButton';

import styles from './ContractualCondition.module.scss';

const ContractualCondition: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    currentContractualCondition,
    requestedBy,
    text,
    openContractualConditions,
  } = useSelector(selectContractualCondition);
  const { setOpenContractualConditions, setRequestedBy, setText } =
    contractualConditionActions;

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
      );
    };
    if (!openContractualConditions) removeContractualConditions();
  }, [
    currentContractualCondition,
    dispatch,
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

  return (
    <div>
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
          <Alert variant="info" text={DISCLAIMERS.newContractualConditions} />
          <div className={styles['contractual-conditions__radio-wrapper']}>
            <p className={styles['contractual-conditions__text']}>
              A nova condição foi uma iniciativa do:
            </p>
            <RadioButton
              id="contractualConditions-policyholder-radio-button"
              data-testid="contractualConditions-policyholder-radio-button"
              name="requestedBy"
              value={CustomClauseRequestedByEnum.POLICYHOLDER}
              label="Tomador"
              selectedValue={requestedBy}
              onChange={handleRequestedBy}
            />
            <RadioButton
              id="contractualConditions-insured-radio-button"
              data-testid="contractualConditions-insured-radio-button"
              name="requestedBy"
              value={CustomClauseRequestedByEnum.INSURED}
              label="Segurado"
              selectedValue={requestedBy}
              onChange={handleRequestedBy}
            />
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
            <h3 className={styles['contractual-conditions__legal-terms-title']}>
              <i className="icon icon-alert-circle" />
              Importante
            </h3>
            <p
              className={styles['contractual-conditions__legal-terms-content']}
            >
              {DISCLAIMERS.resolutionCNSP382}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractualCondition;
