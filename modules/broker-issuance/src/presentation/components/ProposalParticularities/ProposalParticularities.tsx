/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent } from 'react';
import { Alert, TextArea, Toggle } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import ContractualCondition from '../ContractualCondition';
import styles from './ProposalParticularities.module.scss';
import ResolutionCNSP382 from '../ResolutionCNSP382';
import { useProposal } from '../../hooks';

const ProposalParticularities: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { specialAnalysisRequired, specialAnalysisDescription } =
    useSelector(selectProposal);
  const { setSpecialAnalysisRequired, setSpecialAnalysisDescription } =
    proposalActions;
  const createOrUpdateProposal = useProposal();

  const handleSpecialAnalysisRequired = () => {
    dispatch(setSpecialAnalysisRequired(!specialAnalysisRequired));
  };

  const handleSpecialAnalysisDescription = (value: string) => {
    dispatch(setSpecialAnalysisDescription(value));
  };

  const renderSpecialAnalysisDescription = () => {
    if (!specialAnalysisRequired) return null;

    return (
      <div className={styles['proposal-particularities__description']}>
        <TextArea
          id="proposalParticularities-specialAnalysisDescription-text-area"
          data-testid="proposalParticularities-specialAnalysisDescription-text-area"
          label="Indique aqui os ajustes necessários"
          name="proposalParticularitiesDescription"
          placeholder=" "
          value={specialAnalysisDescription}
          onChange={e => handleSpecialAnalysisDescription(e.target.value)}
          maxLength={250}
          onBlur={() => createOrUpdateProposal()}
        />
        <Alert
          variant="info"
          text="Ao informar ajustes e particularidades na proposta, esta será automaticamente encaminhada para análise de nossa equipe. Após essa avaliação, entraremos em contato."
          fullWidth
        />
        <ResolutionCNSP382 />
      </div>
    );
  };

  return (
    <div className={styles['proposal-particularities__wrapper']}>
      <h3 className={styles['proposal-particularities__title']}>
        Particularidades da proposta
      </h3>
      <ContractualCondition />
      <Toggle
        id="proposalParticularities-specialAnalysisRequired-toggle"
        data-testid="proposalParticularities-specialAnalysisRequired-toggle"
        label="Existem particularidades que precisam ser incluídas nessa proposta?"
        name="proposalParticularities-specialAnalysisRequired-toggle"
        checked={specialAnalysisRequired}
        onChange={() => handleSpecialAnalysisRequired()}
      />
      {renderSpecialAnalysisDescription()}
    </div>
  );
};

export default ProposalParticularities;
