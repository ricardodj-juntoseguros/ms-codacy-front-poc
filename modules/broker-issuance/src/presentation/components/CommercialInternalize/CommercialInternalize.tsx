import { TextArea, Toggle } from 'junto-design-system';
import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  issuanceActions,
  selectIssuance,
} from '../../../application/features/issuance/IssuanceSlice';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import {
  deleteAllProposalDocuments,
  selectProposalDocuments,
} from '../../../application/features/proposalDocuments/ProposalDocumentsSlice';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import styles from './CommercialInternalize.module.scss';

const CommercialInternalize: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { policyholder } = useSelector(selectQuote);
  const { forceInternalize, internalizeReason } = useSelector(selectIssuance);
  const { proposalDocuments } = useSelector(selectProposalDocuments);
  const { identification } = useSelector(selectProposal);
  const { setForceInternalize, setInternalizeReason } = issuanceActions;

  const handleToggleChange = () => {
    if (proposalDocuments.length > 0 && identification)
      dispatch(deleteAllProposalDocuments(identification.PolicyId));
    dispatch(setForceInternalize(!forceInternalize));
  };

  if (!policyholder || policyholder.disabledFeatures.forcedInternalization)
    return null;
  return (
    <div className={styles['commercial-internalize__wrapper']}>
      <Toggle
        id="commercialInternalize-toggle"
        data-testid="commercialInternalize-toggle"
        name="commercialInternalize-toggle"
        label="Preciso de uma análise da subscrição para este processo."
        checked={forceInternalize}
        onChange={handleToggleChange}
      />
      {forceInternalize && (
        <div className={styles['commercial-internalize__reason']}>
          <TextArea
            id="commercialInternalize-reason-textarea"
            data-testid="commercialInternalize-reason-textarea"
            label="Descreva a análise"
            placeholder="Levante todos os pontos de atenção para facilitar a análise"
            value={internalizeReason || ''}
            onChange={e => dispatch(setInternalizeReason(e.target.value))}
            maxLength={450}
          />
        </div>
      )}
    </div>
  );
};

export default CommercialInternalize;
