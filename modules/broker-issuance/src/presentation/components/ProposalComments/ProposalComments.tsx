import { Skeleton, TextArea } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { useProposal } from '../../hooks';
import styles from './ProposalComments.module.scss';

const ProposalComments: React.FC = () => {
  const dispatch = useDispatch();
  const updateProposal = useProposal();
  const { comments, currentProposal, loadingProposal } =
    useSelector(selectProposal);
  const [loadingField, setLoadingField] = useState(false);
  const { setComments } = proposalActions;

  useEffect(() => {
    if (!loadingProposal) setLoadingField(false);
  }, [loadingProposal]);

  const handleComments = (comments: string) => {
    dispatch(setComments(comments));
  };

  const handleCommentsBlur = (value: string) => {
    if (currentProposal?.observations !== value) {
      setLoadingField(true);
      updateProposal();
    }
  };

  return (
    <section className={styles['proposal-comments__wrapper']}>
      <p className={styles['proposal-comments__text']}>Observações</p>
      {loadingField ? (
        <Skeleton height={109} width="100%" />
      ) : (
        <TextArea
          id="proposalComments-text-area-comments"
          data-testid="proposalComments-text-area-comments"
          name="proposalComments"
          label="Caso necessário, informe particularidades do processo (opcional)"
          placeholder="Exemplo: coberturas adicionais, etc."
          value={comments}
          onChange={e => handleComments(e.target.value)}
          onBlur={e => handleCommentsBlur(e.target.value)}
        />
      )}
    </section>
  );
};

export default ProposalComments;
