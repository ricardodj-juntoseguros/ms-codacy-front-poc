import { FunctionComponent, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckboxMultiselect,
  InputBase,
  RadioButton,
  RadioGroup,
} from 'junto-design-system';
import { PolicyDocumentRenewalModel } from 'modules/broker-issuance/src/application/types/model';
import {
  getRenewalDocumentList,
  policyRenewalActions,
  selectPolicyRenewal,
} from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import styles from './PolicyRenewalDocuments.module.scss';
import { useProposal } from '../../hooks';

const PolicyRenewalDocuments: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { documentList } = useSelector(selectPolicyRenewal);
  const createOrUpdateProposal = useProposal();
  const { setDocument, setDocumentInputValue, setHasOrdinaryNumbering } =
    policyRenewalActions;

  useEffect(() => {
    if (documentList.length === 0) dispatch(getRenewalDocumentList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialMultiSelect = useMemo(() => {
    const documentSelecteds = [];
    for (let index = 0; index < documentList.length; index += 1) {
      if (documentList[index].active) {
        documentSelecteds.push(documentList[index].value);
      }
    }
    return documentSelecteds;
  }, [documentList]);

  const valueMultiSelect = useMemo(() => {
    const documentSelecteds = documentList.reduce((acc, document) => {
      return document.active ? acc + 1 : acc;
    }, 0);
    if (documentSelecteds === 0) return '';
    return `${documentSelecteds} selecionado${
      documentSelecteds > 1 ? 's' : ''
    }`;
  }, [documentList]);

  const handleSelectRenewalDocument = (
    option: PolicyDocumentRenewalModel,
    active: boolean,
  ) => {
    dispatch(setDocument({ document: option, active }));
  };

  const handleChangeInputValue = (value: string, id: number) => {
    dispatch(setDocumentInputValue({ value, id }));
  };

  const handleChangeHasOrdinaryNumbering = (value: string, id: number) => {
    dispatch(setHasOrdinaryNumbering({ hasOrdinaryNumbering: value, id }));
  };

  const renderRenewalDocumentsInputs = () => {
    if (documentList.length === 0) return null;
    return (
      <ul className={styles['policy-renewal-documents__list']}>
        {documentList.map(document => {
          const {
            id,
            active,
            description,
            inputValue,
            hasChoiceOfNumberingType,
            hasOrdinaryNumbering,
          } = document;
          if (!active) return null;
          const name = description.trim();
          const helperMessage = hasChoiceOfNumberingType
            ? getHelperMessage(description, hasOrdinaryNumbering)
            : '';
          return (
            <li key={name} className={styles['policy-renewal-documents__item']}>
              {hasChoiceOfNumberingType && (
                <>
                  <p
                    className={styles['policy-renewal-documents__description']}
                  >
                    Como você deseja que o número do{' '}
                    <strong>{description}</strong> apareça no objeto?
                  </p>
                  <RadioGroup
                    name={`policyRenewalDocuments-hasOrdinaryNumbering-${id}`}
                    value={hasOrdinaryNumbering.toString()}
                    onChange={v => handleChangeHasOrdinaryNumbering(v, id)}
                  >
                    <div
                      className={
                        styles['policy-renewal-documents__radio-wrapper']
                      }
                    >
                      <RadioButton
                        id={`policyRenewalDocuments-hasOrdinaryNumbering-true-${name}-radio-button`}
                        data-testid={`policyRenewalDocuments-hasOrdinaryNumbering-true-${name}-radio-button`}
                        value="true"
                        label="Formato numérico"
                      />
                      <RadioButton
                        id={`policyRenewalDocuments-hasOrdinaryNumbering-false-${name}-radio-button`}
                        data-testid={`policyRenewalDocuments-hasOrdinaryNumbering-false-${name}-radio-button`}
                        value="false"
                        label="Formato descritivo"
                      />
                    </div>
                  </RadioGroup>
                </>
              )}
              <InputBase
                id={`policyRenewalDocuments-${name}-input`}
                data-testid={`policyRenewalDocuments-${name}-input`}
                label={`Nº ${description}`}
                name={name}
                value={inputValue}
                onChange={e => handleChangeInputValue(e.target.value, id)}
                helperMessage={helperMessage}
                onBlur={() => createOrUpdateProposal()}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  const getHelperMessage = (
    description: string,
    hasOrinaryNumbering: boolean,
  ) => {
    const text = 'O texto no objeto ficará por exemplo:';
    return hasOrinaryNumbering
      ? `${text} "${description} nº 1"`
      : `${text} "Primeiro(a) ${description}"`;
  };

  return (
    <div className={styles['policy-renewal-documents__wrapper']}>
      <CheckboxMultiselect
        id="policyRenewalDocuments-documents-checkbox-multi-select"
        data-testid="policyRenewalDocuments-documents-checkbox-multi-select"
        inputValue={valueMultiSelect}
        onSelectOption={(option: any, checked: boolean) =>
          handleSelectRenewalDocument(option, checked)
        }
        label="Selecione o(s) documento(s) que iniciará a cobertura"
        placeholder="Selecione um ou mais documentos"
        options={documentList}
        variant="large"
        initialSelection={initialMultiSelect}
      />
      {renderRenewalDocumentsInputs()}
    </div>
  );
};

export default PolicyRenewalDocuments;
