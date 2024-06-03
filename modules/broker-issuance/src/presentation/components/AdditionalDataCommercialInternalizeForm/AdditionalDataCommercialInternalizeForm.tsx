import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { GenericComponentProps } from '@shared/hooks';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import AdditionalDataFormWrapper from '../AdditionalDataFormWrapper';
import PaymentFields from '../PaymentFields';
import ProposalDocuments from '../ProposalDocuments';
import ProposalContacts from '../ProposalContacts';
import ProposalComments from '../ProposalComments';
import CommercialAuthorization from '../CommercialAuthorization';
import DraftDownload from '../DraftDownload';
import AdditionalDataFooter from '../AdditionalDataFooter';
import CommercialInternalize from '../CommercialInternalize';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectIssuance } from '../../../application/features/issuance/IssuanceSlice';

const AdditionalDataCommercialInternalizeForm: FunctionComponent<GenericComponentProps> =
  ({ name }) => {
    const { isAutomaticPolicy } = useSelector(selectProposal);
    const { forceInternalize } = useSelector(selectIssuance);
    const userProfile = BrokerPlatformAuthService.getUserProfile();

    const renderCommercialAuthorization = () => {
      return isAutomaticPolicy &&
        !forceInternalize &&
        userProfile === ProfileEnum.COMMERCIAL ? (
        <CommercialAuthorization />
      ) : null;
    };

    const renderCommercialInternalize = () => {
      return isAutomaticPolicy && userProfile === ProfileEnum.COMMERCIAL ? (
        <CommercialInternalize />
      ) : null;
    };

    const renderProposalDocuments = () => {
      return !isAutomaticPolicy || forceInternalize ? (
        <ProposalDocuments />
      ) : null;
    };

    return (
      <AdditionalDataFormWrapper name={name}>
        {renderCommercialInternalize()}
        {renderProposalDocuments()}
        <PaymentFields />
        <ProposalContacts />
        <ProposalComments />
        {renderCommercialAuthorization()}
        <DraftDownload />
        <AdditionalDataFooter />
      </AdditionalDataFormWrapper>
    );
  };

export default AdditionalDataCommercialInternalizeForm;
