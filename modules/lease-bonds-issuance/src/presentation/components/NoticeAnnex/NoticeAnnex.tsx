import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputBase } from 'junto-design-system';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { useProposal } from '../../hooks';

interface NoticeAnnexProps {
  label?: string;
  placeholder?: string;
}

const NoticeAnnex: FunctionComponent<NoticeAnnexProps> = ({
  label = 'Número do anexo do edital (opcional)',
  placeholder = 'Digite o número do anexo do edital',
}) => {
  const dispatch = useDispatch();
  const updateProposal = useProposal();
  const { biddingDescription } = useSelector(selectProposal);
  const { setBiddingDescription } = proposalActions;

  const handleBiddingDescriptionChange = (biddingDescription: string) => {
    dispatch(setBiddingDescription(biddingDescription));
  };

  return (
    <InputBase
      id="noticeAnnex-biddingDescription-input"
      data-testid="noticeAnnex-biddingDescription-input"
      label={label}
      placeholder={placeholder}
      value={biddingDescription}
      onChange={e => handleBiddingDescriptionChange(e.target.value)}
      onBlur={() => updateProposal()}
    />
  );
};

export default NoticeAnnex;
