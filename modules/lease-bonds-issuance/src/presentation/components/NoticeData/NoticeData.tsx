/* eslint-disable consistent-return */
import { FunctionComponent, useMemo } from 'react';
import { TextArea } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { selectQuote } from '../../../application/features/quote/QuoteSlice';
import { NOTICE_DATA_LABELS } from '../../../constants';
import { ModalityTypeEnum } from '../../../application/types/model';
import {
  proposalActions,
  selectProposal,
} from '../../../application/features/proposal/ProposalSlice';
import {
  selectValidation,
  validationActions,
} from '../../../application/features/validation/ValidationSlice';
import { useProposal } from '../../hooks';
import styles from './NoticeData.module.scss';

const NoticeData: FunctionComponent = ({ children }) => {
  const dispatch = useDispatch();
  const updateProposal = useProposal();
  const { modality } = useSelector(selectQuote);
  const { biddingNumber } = useSelector(selectProposal);
  const { errors } = useSelector(selectValidation);
  const { removeErrorMessage } = validationActions;
  const { setBiddingNumber } = proposalActions;

  const noticeDataLabel = useMemo(
    () =>
      modality
        ? NOTICE_DATA_LABELS[modality.id]
        : NOTICE_DATA_LABELS[ModalityTypeEnum.BIDDER],
    [modality],
  );

  const handleBiddingNumberChange = (biddingNumber: string) => {
    dispatch(setBiddingNumber(biddingNumber));
    dispatch(removeErrorMessage('biddingNumber'));
  };

  return (
    <div className={styles['notice-data__wrapper']}>
      <p className={styles['notice-data__description']}>Dados da proposta</p>
      <div className={styles['notice-data__fields']}>
        <TextArea
          id="noticeData-input-biddingNumber"
          data-testid="noticeData-biddingNumber-input"
          label={noticeDataLabel.label}
          placeholder={noticeDataLabel.placeholder}
          maxLength={500}
          value={biddingNumber}
          onChange={e => handleBiddingNumberChange(e.target.value)}
          onBlur={() => updateProposal()}
          errorMessage={errors.biddingNumber && errors.biddingNumber[0]}
        />
        {children}
      </div>
    </div>
  );
};

export default NoticeData;
