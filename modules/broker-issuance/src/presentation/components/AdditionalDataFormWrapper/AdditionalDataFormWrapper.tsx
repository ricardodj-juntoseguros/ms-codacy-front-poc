/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { GenericComponentProps } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { useIssuance } from '../../hooks';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectCommercialAuthorization } from '../../../application/features/CommercialAuthorization/CommercialAuthorizationSlice';
import CommercialAuthorizationModal from '../CommercialAuthorizationModal';
import styles from './AdditionalDataFormWrapper.module.scss';
import { selectIssuance } from '../../../application/features/issuance/IssuanceSlice';

const AdditionalDataFormWrapper: FunctionComponent<GenericComponentProps> = ({
  name,
  children,
}) => {
  const [isCommercialModalOpen, setIsCommercialModalOpen] = useState(false);
  const { isAutomaticPolicy, hasOnlyFinancialPending } =
    useSelector(selectProposal);
  const [createIssuanceOrSubmitToApproval] = useIssuance();
  const history = useHistory();
  const { typeOfAuthorization } = useSelector(selectCommercialAuthorization);
  const { forceInternalize } = useSelector(selectIssuance);
  const userProfile = BrokerPlatformAuthService.getUserProfile();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      isAutomaticPolicy &&
      !forceInternalize &&
      userProfile === ProfileEnum.COMMERCIAL
    ) {
      setIsCommercialModalOpen(true);
      return;
    }
    if (hasOnlyFinancialPending) history.push('/financial-pending');
    createIssuanceOrSubmitToApproval(name);
  };
  return (
    <form
      className={styles['additional-data-form__wrapper']}
      onSubmit={e => handleSubmit(e)}
    >
      {children}
      <CommercialAuthorizationModal
        isModalOpen={isCommercialModalOpen}
        onToggleModal={setIsCommercialModalOpen}
        onConfirm={() => createIssuanceOrSubmitToApproval(name)}
        modalType={typeOfAuthorization}
      />
    </form>
  );
};

export default AdditionalDataFormWrapper;
