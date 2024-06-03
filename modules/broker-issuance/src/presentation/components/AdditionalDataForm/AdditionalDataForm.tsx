import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { GenericComponentProps } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import AdditionalDataFormWrapper from '../AdditionalDataFormWrapper';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import PaymentFields from '../PaymentFields';
import ProposalDocuments from '../ProposalDocuments';
import ProposalContacts from '../ProposalContacts';
import ProposalComments from '../ProposalComments';
import CommercialAuthorization from '../CommercialAuthorization';
import DraftDownload from '../DraftDownload';
import AdditionalDataFooter from '../AdditionalDataFooter';

const AdditionalDataForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  const { isAutomaticPolicy } = useSelector(selectProposal);
  const userProfile = BrokerPlatformAuthService.getUserProfile();

  const renderCommercialAuthorization = () => {
    if (isAutomaticPolicy && userProfile === ProfileEnum.COMMERCIAL) {
      return <CommercialAuthorization />;
    }
    return null;
  };

  return (
    <AdditionalDataFormWrapper name={name}>
      {!isAutomaticPolicy && <ProposalDocuments />}
      <PaymentFields />
      <ProposalContacts />
      <ProposalComments />
      {renderCommercialAuthorization()}
      <DraftDownload />
      <AdditionalDataFooter />
    </AdditionalDataFormWrapper>
  );
};

export default AdditionalDataForm;
