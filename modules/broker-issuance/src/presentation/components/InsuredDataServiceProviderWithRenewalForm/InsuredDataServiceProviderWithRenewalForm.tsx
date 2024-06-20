import { GenericComponentProps } from '@shared/hooks';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { selectPolicyRenewal } from '../../../application/features/policyRenewal/PolicyRenewalSlice';
import InsuredDataFormWrapper from '../InsuredDataFormWrapper';
import InsuredSelection from '../InsuredSelection';
import NoticeData from '../NoticeData';
import PolicyRenewalDocuments from '../PolicyRenewalDocuments';
import ProposalParticularities from '../ProposalParticularities';
import InsuredDataFooter from '../InsuredDataFooter';

const InsuredDataServiceProviderWithRenewalForm: FunctionComponent<GenericComponentProps> =
  ({ name }) => {
    const { isPolicyRenewal } = useSelector(selectPolicyRenewal);

    return (
      <InsuredDataFormWrapper name={name}>
        <InsuredSelection />
        <NoticeData />
        {isPolicyRenewal && <PolicyRenewalDocuments />}
        <ProposalParticularities />
        <InsuredDataFooter />
      </InsuredDataFormWrapper>
    );
  };

export default InsuredDataServiceProviderWithRenewalForm;
